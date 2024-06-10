<script setup lang="ts">
import RowBuilder from "./components/RowBuilder.vue";
</script>

<template>
  <main>
    <div class="masthead">
      <img src="/gear.svg" alt="Blue Gear" />
      <h1>SMHS Component Builder</h1>
    </div>
    <RowBuilder />
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

.masthead {
  display: flex;
  align-items: center;

  :is(img) {
    margin-right: 0.5rem;
  }
}
main {
  padding: 0 1.5em;
}
</style>
