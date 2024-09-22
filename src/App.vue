<script setup lang="ts">
import { ref, computed } from "vue";
import RowBuilder from "./FacultyRowBuilder/components/Input.vue";
import AccoladesBuilder from "./routes/AccoladesBuilder.vue";
import gearSVG from "./assets/gear-svg.vue";

const selectedTool = ref<string>("faculty-rows");
const tools: Record<string, any> = {
  "faculty-rows": RowBuilder,
  oprl: AccoladesBuilder,
};

const currentView = computed(() => {
  return tools[selectedTool.value];
});
</script>

<template>
  <main>
    <div class="masthead">
      <gearSVG />
      <h1>Web Component Builder - SMHS</h1>
      <select v-model="selectedTool" name="Tool Selection" id="tool-select">
        <option value="faculty-rows">Faculty Row Builder</option>
        <option value="oprl">OPRL Accolades Builder</option>
      </select>
    </div>
    <component :is="currentView"></component>
  </main>
</template>

<style>
:root {
  --app-bg-color: #f1f1f1;
  --blue: #005fd7;
  --blue-hover: #013c85;
  --body-bg-color: #ecebeb;
  --border-focus: #9b9b9b;
  --button-bg-color: #e4e4e768;
  --button-border: #e4e4e7;
  --disabled: #b4b4b4;
  --form-shadow: 0px 0px 1.5px #cfcfcf;
  --gw: #022f4e;
  --input-border: #e2e2e6;
  --orange: #ff2f00;
  --red: #ff5640;
  --red-focus: #8d2618;
  --red-hover: #d73d29;
  --select-shadow: 0px 0px 1.5px #989898;
  --white: #ffffff;
}

body,
html {
  margin: 0;
  padding: 0;
}

html {
  scrollbar-gutter: stable both-edges;
  background-color: var(--app-bg-color);
  scroll-behavior: smooth;
}

body {
  background-image: url(./assets/plus.svg);
  background-color: var(--body-bg-color);
  background-repeat: space;
  background-size: 15px;
  min-height: 100vh;
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
  background-color: var(--app-bg-color);
  box-shadow: rgba(33, 35, 38, 0.43) 0px 10px 10px -10px;
  padding: 0 1.5em;

  :is(h1) {
    color: var(--gw);
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  :is(svg) {
    margin-right: 0.5rem;
    animation: rotate 10s linear infinite;
  }

  :is(select) {
    margin-left: 4rem;
    font-weight: 450;
    font-size: 1.25rem;
    border: transparent;
    border-radius: 6px;
    box-shadow: var(--select-shadow);
    padding: 0.15em 0.4em;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
