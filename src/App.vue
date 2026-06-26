<!-- App.vue -->
<template>
  <BApp>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="dark"
      class="sticky-top bg-dark navbar-dark"
    >
      <b-navbar-brand to="/">Flora Occitania</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <!-- liens -->
        <b-navbar-nav>
          <b-nav-item to="/">Accueil</b-nav-item>
          <b-nav-item to="/projet">Présentation</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ms-auto" v-if="route.path === '/'">
          <taxonSearch />
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container">
      <router-view />
    </div>
  </BApp>
</template>

<script setup lang="ts">
import { BApp } from "bootstrap-vue-next";
import { useRoute } from "vue-router";

import taxonSearch from "@/components/taxonSearch.vue";

const route = useRoute();
</script>
