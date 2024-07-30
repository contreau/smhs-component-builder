<script setup lang="ts">
import { store } from "../store";

function createAdditionalTitles() {
  if (store.remainingTitles < 5 && store.remainingTitles > 0) {
    store.titles.push("");
    store.remainingTitles--;
  }
}

function trimInput(event: Event, state: string) {
  const refs: Record<string, string> = {
    nameText: store.nameText,
    titleText: store.titleText,
    profileLink: store.profileLink,
    email: store.email,
    bulletText: store.bulletText,
  };
  setTimeout(() => {
    const target = event.target as HTMLInputElement;
    refs[state] = target.value.trim();
  }, 0);
}

function trimTitlesInput(event: Event, index: number) {
  const target = event.target as HTMLInputElement;
  setTimeout(() => {
    store.titles[index] = target.value.trim();
  }, 0);
}

function deleteTitle(titleIndex: number) {
  store.titles.splice(titleIndex, 1);
  store.remainingTitles++;
}
</script>

<template>
  <div class="form-item">
    <h4>Title</h4>
    <input
      v-model="store.titleText"
      type="text"
      @paste="trimInput($event, 'titleText')"
      placeholder="Edit Title"
    />
  </div>

  <!-- Generated Title Input -->
  <div v-for="(_, i) in store.titles" class="form-item">
    <h4>Title {{ i + 2 }}</h4>
    <input
      v-model="store.titles[i]"
      type="text"
      @paste="trimTitlesInput($event, i)"
      placeholder="Edit Title"
    />
    <button class="delete-button" @click="deleteTitle(i)">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>

  <button
    v-if="store.remainingTitles > 0"
    class="btn-addTitle"
    @click="createAdditionalTitles"
  >
    <i class="fa-solid fa-scroll"></i>&nbsp; Add Title (
    {{ store.remainingTitles }} remaining )
  </button>
</template>
