<template>
  <b-form class="d-flex">
    <b-form-input
      v-model="taxonsListStore.search"
      placeholder="Rechercher..."
      class="me-2"
    />
  </b-form>
</template>

<script setup>
import { TaxonsStore } from "@/stores/taxonsStore";

const taxonsListStore = TaxonsStore();
</script>
