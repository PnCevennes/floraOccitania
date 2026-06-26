<template>
  <div v-if="taxonDetail">
    <div class="p-3 border">
      <div class="row">
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
        <div class="col">
          <h1>{{ taxonDetail?.nom_complet }}</h1>
          <h3>{{ taxonDetail?.nom_vern }}</h3>
          <h3>{{ taxonDetail?.agg_noms_occ }}</h3>
        </div>
      </div>
    </div>

    <div v-for="(item, index) in taxonDetail.noms_occ" :key="item.id">
      <div class="m-3 p-3 border" v-if="item.nom">
        <h2>{{ item.nom }}</h2>
        <div class="pt-3">{{ item.commentaire }}</div>
        <div>Nom utilisé dans les massifs :</div>
        <ul>
          <li v-for="loc in item.localisation" :key="loc.id">
            {{ loc }}
          </li>
        </ul>
        <h3 v-b-toggle="'collapse-' + index">Sources</h3>
        <BCollapse :id="'collapse-' + index">
          <BCard class="mt-4">
            <div class="pt-3" v-for="source in item.sources" :key="source.id">
              {{ source }}
            </div>
          </BCard>
        </BCollapse>
      </div>
    </div>
    <div class="m-3 p-3 border">
      <div class="pt-3">
        <h3>Usages locaux</h3>
        <div class="pt-3">
          <div>Parties utilisées :</div>
          <ul>
            <li v-for="val in usages.usage_partie" :key="val.id">
              {{ val }}
            </li>
          </ul>
        </div>
        <div class="pt-3">
          <div>Type d'usage :</div>
          <ul>
            <li v-for="val in usages.usage_type" :key="val.id">
              {{ val }}
            </li>
          </ul>
        </div>
        <div>Description des usages :</div>
        <span style="white-space: pre-wrap">{{
          usages.usage_description
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

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
      usages.usage_description = element.valeur_attribut;
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
