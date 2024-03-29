<template>
  <article
    class="github-project"
    :class="project.primaryLanguage.name"
  >
    <div class="head flex justify-between">
      <h3 class="font-bold hover:text-content-lighter duration-200">
        {{ project.name }}
      </h3>
      <a
        :href="project.url"
        target="_blank"
        rel="noopener"
        class="hover:text-link duration-200 ease-out"
      >
        <span class="visually-hidden">Link to {{ project.name }}'s github repository</span>
        <fa :icon="['fas', 'link']" />
      </a>
    </div>
    <div class="stats my-1 text-yellow">
      <fa :icon="['fas', 'star']" /> {{ project.stargazers.totalCount }}
    </div>
    <p v-if="project.description">
      {{ project.description }}
    </p>
  </article>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { Repository } from 'types/github';

interface Props {
  project: Repository
}

export default defineComponent<Props>({
  name: 'GithubComponent',
  props: {
    project: {
      type: Object as () => Repository,
    },
  },
});
</script>

<style scoped>
.github-project {
  @apply px-5 py-10 rounded-sm shadow;
  @apply duration-500 ease-out;
  @apply font-light text-content;

  @apply border-t-4;
}

.github-project:hover {
  @apply shadow-xl;
}

.github-project.TypeScript {
  border-color: #2b7489;
}

.github-project.JavaScript {
  border-color: #f1e05a;
}

.github-project.Vue {
  border-color: #2c3e50;
}

.github-project.Go {
  border-color: #00ADD8;
}

.github-project.Shell {
  border-color: #89e051;
}

.github-project.PHP {
  border-color: #4F5D95;
}
</style>
