<template>
  <div>
    <Navbar />
    <nuxt keep-alive />
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default defineComponent({
  name: 'DefaultLayout',
  components: { Navbar, Footer },
});
</script>

<style>
</style>
