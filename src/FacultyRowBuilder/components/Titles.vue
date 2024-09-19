<script setup lang="ts">
import { store } from "../store";
import { nextTick, ref } from "vue";
import trashSVG from "../../assets/trash-svg.vue";

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

const currentFocusedInput = ref<number>(0);

function updateCurrentFocusedInput(index: number) {
  currentFocusedInput.value = index;
}

function navigateBetweenTitles(event: KeyboardEvent) {
  const titleInputs: HTMLInputElement[] = Array.from(
    document.querySelectorAll('input[placeholder="Edit Title"]')
  );
  if (event.key === "ArrowDown") {
    if (
      currentFocusedInput.value >= 0 &&
      currentFocusedInput.value !== titleInputs.length - 1
    ) {
      titleInputs[currentFocusedInput.value + 1].focus();
    }
  } else if (event.key === "ArrowUp") {
    if (currentFocusedInput.value > 0) {
      titleInputs[currentFocusedInput.value - 1].focus();
    }
  }
}
</script>

<template>
  <div class="form-item">
    <h4>
      Titles
      <span style="font-weight: 400; color: #000000"
        >({{ store.remainingTitles }} more remaining)</span
      >
    </h4>
    <input
      v-model.trim="store.titleText"
      type="text"
      placeholder="Edit Title"
      @keyup.enter="createAdditionalTitles"
      @keyup="navigateBetweenTitles($event)"
      @focus="updateCurrentFocusedInput(0)"
    />
  </div>

  <!-- Generated Title Input -->
  <div v-for="(_, i) in store.titles" class="form-item">
    <h4>Title {{ i + 2 }}</h4>
    <div class="flex-container">
      <input
        v-model.trim="store.titles[i]"
        type="text"
        placeholder="Edit Title"
        @keyup.shift.delete="deleteTitle(i)"
        @keyup.enter="createAdditionalTitles"
        @keyup="navigateBetweenTitles($event)"
        @focus="updateCurrentFocusedInput(i + 1)"
      />
      <button
        class="delete-button"
        aria-label="Delete Title"
        @click="deleteTitle(i)"
      >
        <trashSVG />
      </button>
    </div>
  </div>
</template>
