<script setup lang="ts">
import { store } from "../store";

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
}

function deleteBulletPoint(bulletIndex: number) {
  store.bullets.splice(bulletIndex, 1);
  store.remainingBullets++;
}

function trimBulletsInput(event: Event, index: number) {
  const target = event.target as HTMLInputElement;
  setTimeout(() => {
    store.bullets[index] = target.value.trim();
  }, 0);
}

function clearBullets() {
  if (!store.enableBullets) {
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
      @change="clearBullets"
      v-model="store.enableBullets"
    />
    <h4>
      <label for="checkbox">Add Bulleted Information (Optional) </label>
    </h4>
  </div>

  <div v-if="store.enableBullets" class="form-item">
    <h4>Bullet 1</h4>
    <input
      v-model="store.bulletText"
      type="text"
      @paste="trimInput($event, 'bulletText')"
      placeholder="Edit Bullet"
    />
  </div>
  <!-- Generated Bullet Input -->
  <div v-for="(_, i) in store.bullets" class="form-item">
    <h4>Bullet {{ i + 2 }}</h4>
    <input
      v-model="store.bullets[i]"
      type="text"
      @paste="trimBulletsInput($event, i)"
      placeholder="Edit Bullet"
    />
    <button class="delete-button" @click="deleteBulletPoint(i)">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
  <button
    @click="createBulletPoint"
    v-if="store.enableBullets && store.remainingBullets > 0"
  >
    <span style="color: #008bd0; font-size: 0.5rem; vertical-align: 2.2px"
      ><i class="fa-solid fa-circle"></i></span
    >&nbsp; Add Bullets ({{ store.remainingBullets }} remaining)
  </button>
</template>
