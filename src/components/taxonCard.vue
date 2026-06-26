<template>
  <b-card
    :title="taxonData.agg_noms_occ || taxonData.nom_complet"
    :img-src="media"
    img-alt="Image"
    img-top
    tag="article"
    style="max-width: 20rem"
    class="mb-2 card-fixed-img"
  >
    <b-card-text>
      <div>{{ taxonData.nom_complet }}</div>
      <div>{{ taxonData.nom_vern }}</div>
    </b-card-text>

    <b-button :to="'detail/' + taxonData.cd_ref" variant="primary"
      >Détail</b-button
    >
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
