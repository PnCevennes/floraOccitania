<template>
  <b-card
    :title="taxonData.agg_noms_occ || taxonData.nom_complet"
    :img-src="media"
    footer-tag="footer"
    img-alt="Image"
    img-top
    tag="article"
    style="max-width: 20rem"
    class="mb-2 card-fixed-img h-100"
  >
    <b-card-text class="h-80">
      <div>
        <i>{{ taxonData.nom_complet }}</i>
      </div>
      <div>{{ taxonData.nom_vern }}</div>
    </b-card-text>
    <template #footer>
      <div class="text-end">
        <BButton :to="'detail/' + taxonData.cd_ref" class="bg-success">
          En savoir plus <i class="bi bi-box-arrow-up-right"></i>
        </BButton>
      </div>
    </template>
  </b-card>
</template>

<style>
.card-fixed-img img {
  height: 200px; /* hauteur fixe */
  width: 100%; /* prend toute la largeur */
  object-fit: cover; /* rogne proprement l'image */
}
.card-footer {
  background-color: #ffffff;
  border: none;
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
