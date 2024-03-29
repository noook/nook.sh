<template>
  <div class="text-content">
    <header class="px-4 py-20 text-center">
      <h1 class="text-4xl font-bold">
        Hi! I'm <span class="text-accent">Neil&nbsp;Richter</span>
      </h1>
      <h2 class="text-xl">
        Fullstack Typescript Developer @<a href="https://beamy.io" class="underline">Beamy</a>
      </h2>
    </header>
    <main class="my-5">
      <div id="about" class="my-3 p-4 bg-lightgray flex flex-col items-center">
        <picture>
          <source type="image/x-jpf" srcset="https://i.nook.sh/pp-squared@180.jpf">
          <source type="image/webp" srcset="https://i.nook.sh/pp-squared@180.webp">
          <img
            class="rounded-full w-40 my-4 mx-auto"
            src="https://i.nook.sh/pp-squared.jpg"
            alt="Neil Richter's profile picture"
          >
        </picture>
        <p class="w-3/4 lg:w-1/2 text-lg lg:text-center my-5 mx-10">
          I'm a {{ age }} years old Front-End engineer based in Paris, working at
          <a class="font-bold hover:underline" href="https://beamy.io">Beamy</a>.
          I love working on side projects to improve my skills.
          I love swimming, motorcycling, music and spicy food.
        </p>
        <nuxt-link
          class="bg-accent text-white py-2 px-4 my-4 rounded hover:opacity-75 duration-75"
          :to="{ name: 'about' }">
          Read more
        </nuxt-link>
        <Socials class="text-3xl" />
      </div>
      <section id="pinned-repositories" class="my-3 p-4 text-content">
        <h2 class="text-2xl text-center font-bold">
          Top projects
        </h2>
        <h3 class="text-center">
          Pinned repositories on Github
        </h3>
        <div
          class="my-5 px-5 lg:px-20 xl:px-64 projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <GithubProject
            v-for="(project, index) in $store.state.projects"
            :key="index"
            :project="project"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import GithubProject from '@/components/GithubProject.vue';
import Socials from '@/components/Socials.vue';
import getAge from '@/hooks/age';

export default defineComponent({
  name: 'Index',
  components: { GithubProject, Socials },
  setup() {
    const projects = ref([]);

    return {
      age: ref<number>(getAge()),
      projects,
    };
  },
});
</script>

<style lang="scss">
</style>
