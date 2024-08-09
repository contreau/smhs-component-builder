<script setup lang="ts">
import { store } from "../store";
import { nextTick } from "vue";

let lastFocusedInput: HTMLInputElement;
function saveFocusedInput(event: Event) {
  lastFocusedInput = event?.target as HTMLInputElement;
  console.log(lastFocusedInput);
}

function createAdditionalTitles() {
  if (store.remainingTitles < 5 && store.remainingTitles > 0) {
    store.titles.push("");
    store.remainingTitles--;
    nextTick(() => {
      const titleInputs: HTMLInputElement[] = Array.from(
        document.querySelectorAll('input[placeholder="Edit Title"]')
      );
      titleInputs.at(-1)?.focus();
    });
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
  console.log(document.activeElement);
  nextTick(() => {
    const titleInputs: HTMLInputElement[] = Array.from(
      document.querySelectorAll('input[placeholder="Edit Title"]')
    );
    for (let i = 0; i < titleInputs.length; i++) {
      if (titleInputs[i] === lastFocusedInput) {
        titleInputs[i].focus();
        break;
      }
    }
  });

  // TODO: add focus step for when last item is deleted - currently does not focus when this happens
}
</script>

<template>
  <div class="form-item">
    <h4>Title</h4>
    <input
      v-model="store.titleText"
      type="text"
      @paste="trimInput($event, 'titleText')"
      @focus="saveFocusedInput($event)"
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
      @focus="saveFocusedInput($event)"
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
