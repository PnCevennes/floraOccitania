<!-- App.vue -->
<template>
  <BApp>
    <b-navbar toggleable="lg" class="sticky-top bg-light org-navbar">
      <b-navbar-brand to="/">
        <img
          src="https://destination.cevennes-parcnational.fr/medias/img/Spirale_orange_512pxl.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt=""
        />
        Flors de Cevenas</b-navbar-brand
      >

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <!-- liens -->
        <b-navbar-nav>
          <b-nav-item to="/">Accueil</b-nav-item>
          <b-nav-item to="/projet">Présentation</b-nav-item>
          <b-nav-item
            href="https://www.cevennes-parcnational.fr/fr/le-parc-national-des-cevennes/la-reglementation-du-coeur"
            target="_blank"
            rel="noopener noreferrer"
            ><i class="bi bi-box-arrow-up-right"></i> La
            réglementation</b-nav-item
          >
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
