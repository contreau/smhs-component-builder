<script setup lang="ts">
import { store } from "../store";
import { nextTick, ref } from "vue";
import trashSVG from "../../assets/trash-svg.vue";

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

function createBulletPoint() {
  if (store.remainingBullets < 5 && store.remainingBullets > 0) {
    store.bullets.push("");
    store.remainingBullets--;
  }
  nextTick(() => {
    const bulletInputs: HTMLInputElement[] = Array.from(
      document.querySelectorAll('input[placeholder="Edit Bullet"]')
    );
    bulletInputs.at(-1)?.focus();
  });
}

function deleteBulletPoint(bulletIndex: number) {
  store.bullets.splice(bulletIndex, 1);
  store.remainingBullets++;
  nextTick(() => {
    const titleInputs: HTMLInputElement[] = Array.from(
      document.querySelectorAll('input[placeholder="Edit Bullet"]')
    );
    if (titleInputs.length > bulletIndex + 1) {
      titleInputs[bulletIndex + 1].focus();
    } else {
      titleInputs.at(-1)?.focus();
    }
  });
}

function trimBulletsInput(event: Event, index: number) {
  const target = event.target as HTMLInputElement;
  setTimeout(() => {
    store.bullets[index] = target.value.trim();
  }, 0);
}

const currentFocusedBulletInput = ref<number>(0);

function updateCurrentFocusedBulletInput(index: number) {
  currentFocusedBulletInput.value = index;
}

function navigateBetweenBullets(event: KeyboardEvent) {
  const bulletInputs: HTMLInputElement[] = Array.from(
    document.querySelectorAll('input[placeholder="Edit Bullet"]')
  );
  if (event.key === "ArrowDown") {
    if (
      currentFocusedBulletInput.value >= 0 &&
      currentFocusedBulletInput.value !== bulletInputs.length - 1
    ) {
      bulletInputs[currentFocusedBulletInput.value + 1].focus();
    }
  } else if (event.key === "ArrowUp") {
    if (currentFocusedBulletInput.value > 0) {
      bulletInputs[currentFocusedBulletInput.value - 1].focus();
    }
  }
}

function handleBulletToggle() {
  if (store.enableBullets) {
    nextTick(() => {
      const firstInput: HTMLInputElement | null = document.querySelector(
        'input[placeholder="Edit Bullet"]'
      );
      if (firstInput !== null) {
        firstInput.focus();
      }
    });
  } else if (!store.enableBullets) {
    store.bulletText = "";
    store.bullets = [];
    store.remainingBullets = 4;
  }
}
</script>

<template>
  <div class="checkbox-container">
    <input
      id="checkbox"
      type="checkbox"
      @change="handleBulletToggle"
      v-model="store.enableBullets"
    />
    <h4>
      <label for="checkbox"
        >Optional: Add Bulleted Text
        <span v-if="store.enableBullets" class="remaining-bullets"
          >({{ store.remainingBullets }} more remaining)</span
        ></label
      >
    </h4>
  </div>

  <div v-if="store.enableBullets" class="form-item">
    <h4>Bullet 1</h4>
    <input
      v-model="store.bulletText"
      type="text"
      @paste="trimInput($event, 'bulletText')"
      placeholder="Edit Bullet"
      @keyup.enter="createBulletPoint"
      @keyup="navigateBetweenBullets($event)"
      @focus="updateCurrentFocusedBulletInput(0)"
    />
  </div>
  <!-- Generated Bullet Input -->
  <div v-for="(_, i) in store.bullets" class="form-item">
    <h4>Bullet {{ i + 2 }}</h4>
    <div class="flex-container">
      <input
        v-model="store.bullets[i]"
        type="text"
        @paste="trimBulletsInput($event, i)"
        placeholder="Edit Bullet"
        @keyup.shift.delete="deleteBulletPoint(i)"
        @keyup.enter="createBulletPoint"
        @keyup="navigateBetweenBullets($event)"
        @focus="updateCurrentFocusedBulletInput(i + 1)"
      />
      <button class="delete-button" @click="deleteBulletPoint(i)">
        <trashSVG />
      </button>
    </div>
  </div>
</template>

<style scoped>
p.shortcut-info {
  margin-top: 0;
  font-size: 0.9rem;
  :is(span).key {
    font-weight: 500;
    background-color: #d2d2d369;
    padding: 0.1em 0.25em 0.25em 0.25em;
    border-radius: 5px;
  }
}

.remaining-bullets {
  font-weight: 400;
}
</style>
