import { defineStore } from "pinia";
import config from "@/assets/config";

interface State {
  allItems: any[];
  visibleItems: any[];
  hasMore: boolean;
  index: number;
  chunkSize: number;
  search: string;
  init: boolean | undefined;
}

interface TaxhubItem {
  attributs: any[];
  medias: any[];
  cd_ba: number;
  cd_nom: number;
  cd_ref: number;
  cd_sup: number;
  cd_taxsup: number;
  classe: string;
  famille: string;
  nom_complet: string;
  nom_vern: string;
  group1_inpn: string;
  group2_inpn: string;
  group3_inpn: string;
  id_habitat: string;
  id_rang: string;
  id_statut: string;
  lb_auteur: string;
  lb_nom: string;
  noms_occ: any[];
  agg_noms_occ: string;
}

export const TaxonsStore = defineStore("taxon", {
  state: (): State => ({
    allItems: [],
    visibleItems: [],
    hasMore: true,
    index: 0,
    chunkSize: 20,
    search: "",
    init: undefined,
  }),

  actions: {
    async fetchItems() {
      this.init = false;
      const res = await fetch(
        `${config.apiUrl}/taxhub/api/taxref/?id_liste=${config.idList}&fields=attributs.bib_attribut.nom_attribut,medias,attributs&limit=${config.limit}`,
      );
      const data = (await res.json()).items;
      data.forEach((item: TaxhubItem) => {
        let taxonList = item;
        const occ_attr = item.attributs.filter(
          (item) => item.bib_attribut?.nom_attribut == "nom_occitan",
        );
        try {
          taxonList.noms_occ = JSON.parse(occ_attr[0].valeur_attribut);
          taxonList.agg_noms_occ = taxonList.noms_occ
            .map((item) => item.nom)
            .join(", ");
        } catch (error) {
          console.log(item.nom_complet, error);
        }
        this.allItems.push(taxonList);
      });
      await this.loadMore();
      this.init = true;
    },
    async loadMore() {
      if (this.init === undefined) {
        await this.fetchItems();
      }
      this.hasMore = true;
      const source = this.filteredAndSorted;
      const next = source.slice(this.index, this.index + this.chunkSize);
      this.visibleItems.push(...next);
      this.index += this.chunkSize;

      if (this.chunkSize > source.length) {
        this.hasMore = false;
      }
    },
    async getOne(id: number) {
      if (this.init === undefined) {
        await this.fetchItems();
      }
      const taxonDetail = this.allItems.find((item) => {
        if (item.cd_ref === id) {
          return item;
        }
      });
      return taxonDetail;
    },
  },
  getters: {
    filteredAndSorted(state) {
      let taxonList = state.allItems;
      if (state.search.length > 1) {
        taxonList = taxonList
          // ✅ filtre
          .filter((item) => {
            const matchSearchComplet = (item.nom_complet || "")
              .toLowerCase()
              .includes(state.search.toLowerCase());
            const matchSearchOccitan = (item.agg_noms_occ || "")
              .toLowerCase()
              .includes(state.search.toLowerCase());
            return matchSearchOccitan || matchSearchComplet;
          });
      }
      return (
        // ✅ tri alphanumérique
        taxonList.sort((a, b) =>
          a.nom_complet.localeCompare(b.nom_complet, "fr", {
            numeric: true,
            sensitivity: "base",
          }),
        )
      );
    },
  },
});
