<template>
  <b-card
    :title="taxonData.agg_noms_occ || taxonData.nom_complet"
    :img-src="media"
    img-alt="Image"
    img-top
    tag="article"
    style="max-width: 20rem"
    class="mb-2 card-fixed-img h-100 d-flex flex-column"
  >
    <b-card-text class="flex-grow-1">
      <div>
        <i>{{ taxonData.nom_complet }}</i>
      </div>
      <div>{{ taxonData.nom_vern }}</div>
    </b-card-text>

    <div
      class="text-center mt-auto"
      style="position: absolute; bottom: 5px; right: 20px"
    >
      <BButton :to="'detail/' + taxonData.cd_ref" class="bg-success">
        En savoir plus <i class="bi bi-box-arrow-up-right"></i>
      </BButton>
    </div>
  </b-card>
</template>
<style>
.card-fixed-img img {
  height: 200px; /* hauteur fixe */
  width: 100%; /* prend toute la largeur */
  object-fit: cover; /* rogne proprement l'image */
}
</style>
<script setup>
import { computed } from "vue";

const props = defineProps({
  taxonData: Object,
});

const media = computed(() => {
  return props.taxonData.medias?.[0]?.media_url || "img_default.jpg";
});
</script>
