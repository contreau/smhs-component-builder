<script setup lang="ts">
import { ref, computed } from "vue";
import Landing from "./components/Landing.vue";
import RowBuilder from "./components/RowBuilder.vue";
import AccoladesBuilder from "./components/AccoladesBuilder.vue";

const routes: Record<string, any> = {
  "/": Landing,
  "/row-builder": RowBuilder,
  "/accolades": AccoladesBuilder,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"];
});
</script>

<template>
  <main>
    <div class="masthead">
      <img src="/gear.svg" alt="Blue Gear" />
      <h1>SMHS Component Builder</h1>
      <ul>
        <li><a href="#/">About</a></li>
        <li><a href="#/row-builder">Faculty Table Rows</a></li>
        <li><a href="#/accolades">OPRL Accolades</a></li>
      </ul>
    </div>
    <component :is="currentView"></component>
    <!-- <RowBuilder /> -->
  </main>
</template>

<style>
:root {
  --gw: #022f4e;
  --orange: #ff2f00;
  --white: #ffffff;
}

html {
  scrollbar-gutter: stable both-edges;
  margin: 0;
  padding: 0;
  background-color: #f1f1f1;
}

img {
  max-width: 100%;
  height: auto;
}

h2 {
  color: var(--gw);
}

.masthead {
  display: flex;
  align-items: center;

  h1 {
    color: var(--gw);
  }

  :is(img) {
    margin-right: 0.5rem;
    animation: rotate 10s linear infinite;
  }

  :is(ul) {
    padding-left: 0;
    margin-left: 5rem;
    display: flex;
    gap: 6.5rem;
    list-style-type: none;

    :is(li) {
      font-size: 1.4rem;
      font-weight: 500;
    }

    :is(a) {
      text-decoration: none;
      color: var(--gw);
      &:hover,
      &:focus {
        border: none;
      }
    }
  }
}
main {
  padding: 0 1.5em;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
