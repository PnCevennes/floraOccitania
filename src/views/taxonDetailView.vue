<template>
  <div v-if="taxonDetail">
    <div class="p-3">
      <div class="row">
        <div class="col d-flex flex-column">
          <h1>
            <i>{{ taxonDetail?.nom_complet }}</i>
          </h1>
          <h3 class="pt-3">{{ taxonDetail?.agg_noms_occ }}</h3>
          <h4 class="pt-3">{{ taxonDetail?.nom_vern }}</h4>
          <div class="pt-3">
            <BButton href="#noms" class="btn btn-success"
              ><i class="bi bi-leaf"
                ><span class="p-2">Dénominations locales</span></i
              ></BButton
            >
          </div>
          <div class="pt-3">
            <BButton href="#usages" class="btn btn-success"
              ><i class="bi bi-egg-fried"
                ><span class="p-2">Usages traditionnels</span></i
              ></BButton
            >
          </div>
          <div class="pt-3 mt-auto text-end">
            <BButton
              :href="`https://biodiversite.cevennes-parcnational.fr/espece/${cd_ref}`"
              target="_blank"
              class="btn btn-warning"
              ><i class="bi bi-box-arrow-up-right"
                ><span class="p-2">Biodiv'Cévennes</span></i
              ></BButton
            >
          </div>
        </div>
        <div class="col">
          <BCarousel
            controls
            indicators
            fade
            ride="carousel"
            class="my-carousel"
          >
            <BCarouselSlide
              v-for="media in taxonDetail?.medias"
              :key="media.id"
              :img-src="media.url"
              :caption="media.titre"
            />
          </BCarousel>
        </div>
      </div>
    </div>
    <section id="noms">
      <div class="m-3 p-3 border">
        <h3 class="p-3 mb-2 bg-success text-white">
          <i class="bi bi-leaf"></i> Dénominations locales
        </h3>
        <div v-for="(item, index) in taxonDetail.noms_occ" :key="item.id">
          <div class="m-3 p-3 border" v-if="item.nom">
            <h2>{{ item.nom }}</h2>
            <div class="pt-3">{{ item.commentaire }}</div>

            <div class="pt-3" v-if="(item.localisation || []).length > 0">
              <u class="bi bi-geo"><b>Localisation de la dénomination :</b> </u>
              <ul>
                <li v-for="loc in item.localisation" :key="loc.id">
                  {{ loc }}
                </li>
              </ul>
            </div>
            <div class="pt-3">
              <h5
                v-b-toggle="'collapse-' + index"
                class="cursor-pointer hover:text-primary-emphasis"
              >
                <u class="bi bi-journal-plus"> Bibliographie : </u>
              </h5>
              <BCollapse :id="'collapse-' + index">
                <BCard class="mt-2 border-0">
                  <div
                    class="pt-3"
                    v-for="source in item.sources"
                    :key="source.id"
                  >
                    {{ source }}
                  </div>
                </BCard>
              </BCollapse>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="usages">
      <div class="m-3 p-3 border">
        <div class="pt-3">
          <h3 class="p-3 mb-2 bg-success text-white">
            <i class="bi bi-egg-fried"></i> Usages traditionnels
          </h3>
          <div class="pt-3">
            <h5>
              <u class="bi bi-flower2"
                ><b class="p-1">Parties utilisées :</b></u
              >
            </h5>
            <ul>
              <li v-for="val in usages.usage_partie" :key="val.id">
                {{ val }}
              </li>
            </ul>
          </div>
          <div class="pt-3">
            <h5>
              <u class="bi bi-lightbulb"><b class="p-1">Type d'usage :</b></u>
            </h5>
            <ul>
              <li v-for="val in usages.usage_type" :key="val.id">
                {{ val }}
              </li>
            </ul>
          </div>
          <h5>
            <u class="bi bi-journal-medical"
              ><b class="p-1">Description des usages :</b></u
            >
          </h5>
          <div v-html="usages.usage_description" class="mt-3"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { marked } from "marked";
import { useRoute } from "vue-router";

import { TaxonsStore } from "@/stores/taxonsStore";

const route = useRoute();

const taxonDetail = ref(null);
const cd_ref = ref(null);

onMounted(async () => {
  cd_ref.value = parseInt(route.params.id);
  taxonDetail.value = await TaxonsStore().getOne(cd_ref.value);
});

const usages = computed(() => {
  let usages = {};
  taxonDetail.value.attributs.forEach((element) => {
    if (element.bib_attribut?.nom_attribut == "usage_partie") {
      usages.usage_partie = element.valeur_attribut.split("&");
    } else if (element.bib_attribut?.nom_attribut == "usage_type") {
      usages.usage_type = element.valeur_attribut.split("&");
    } else if (element.bib_attribut?.nom_attribut == "usage_description") {
      usages.usage_description = marked(element.valeur_attribut);
    }
  });
  return usages;
});
</script>

<style>
.carousel-inner {
  height: 400px;
}

.carousel-inner img {
  height: 400px;
  width: 100%;
  object-fit: cover;
}
</style>
