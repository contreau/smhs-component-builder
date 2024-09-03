<script setup lang="ts">
import { store } from "../store";
import { nextTick } from "vue";

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
  nextTick(() => {
    const titleInputs: HTMLInputElement[] = Array.from(
      document.querySelectorAll('input[placeholder="Edit Title"]')
    );
    if (titleInputs.length > titleIndex + 1) {
      titleInputs[titleIndex + 1].focus();
    } else {
      titleInputs.at(-1)?.focus();
    }
  });
}
</script>

<template>
  <div class="form-item">
    <h4>Titles ({{ store.remainingTitles }} more remaining)</h4>
    <p class="shortcut-info">
      <span class="key">Enter</span> creates new titles.
      <span class="key">Shift + Backspace</span>
      deletes them.
    </p>
    <input
      v-model="store.titleText"
      type="text"
      @paste="trimInput($event, 'titleText')"
      placeholder="Edit Title"
      @keyup.enter="createAdditionalTitles"
    />
  </div>

  <!-- Generated Title Input -->
  <div v-for="(_, i) in store.titles" class="form-item">
    <h4>Title {{ i + 2 }}</h4>
    <div class="flex-container">
      <input
        v-model="store.titles[i]"
        type="text"
        @paste="trimTitlesInput($event, i)"
        placeholder="Edit Title"
        @keyup.shift.delete="deleteTitle(i)"
        @keyup.enter="createAdditionalTitles"
      />
      <button class="delete-button" @click="deleteTitle(i)">
        <img src="/trash.svg" height="22" width="22" alt="Delete" />
      </button>
    </div>
  </div>
</template>

<style scoped>
p.shortcut-info {
  margin-top: 0;
  font-size: 0.85rem;
  br {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  span.key {
    font-weight: 500;
    background-color: #d2d2d369;
    padding: 0.1em 0.25em 0.25em 0.25em;
    border-radius: 5px;
  }
}
</style>
