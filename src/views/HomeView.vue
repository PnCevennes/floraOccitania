<template>
  <div>
    <b-card-group deck>
      <div
        v-for="item in taxonsListStore.visibleItems"
        :key="item.id"
        class="col-12 col-md-6 col-lg-3"
      >
        <taxonCard :taxonData="item"></taxonCard>
      </div>
    </b-card-group>
    <div ref="trigger" class="text-center py-4">
      <b-spinner v-if="taxonsListStore.hasMore" />
    </div>
  </div>
</template>

<script setup lang="ts">
import taxonCard from "../components/taxonCard.vue";

import { ref, onMounted, watch } from "vue";
import { TaxonsStore } from "@/stores/taxonsStore";

const taxonsListStore = TaxonsStore();
const trigger = ref<HTMLElement | null>(null);

onMounted(() => {
  const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
     if (
      entries[0] &&
      entries[0].isIntersecting &&
      taxonsListStore.hasMore &&
      taxonsListStore.init
    ) {
      taxonsListStore.loadMore();
    }
  });

  if (!trigger.value) return;

  observer.observe(trigger.value);
  taxonsListStore.loadMore();
});

watch(
  () => taxonsListStore.search,
  () => {
    taxonsListStore.index = 0;
    taxonsListStore.visibleItems = [];
    taxonsListStore.loadMore();
  },
);

const items = ref([]);
</script>
