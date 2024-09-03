<script setup lang="ts">
import { store } from "../store";
import Titles from "./Titles.vue";
import Bullets from "./Bullets.vue";
import Previews from "./Previews.vue";

// TODO:
// Add either a toggle or string parser for email input to treat mailto and https urls differently
// Add toggle to disable just email or just profile urls

function clearFields() {
  store.titleText = "";
  store.nameText = "";
  store.profileLink = "";
  store.email = "";
  store.bulletText = "";
  store.remainingTitles = 4;
  store.remainingBullets = 4;
  store.titles = [];
  store.bullets = [];
  store.enableBullets = false;
  store.disableURLs = false;
}

function clearURLs() {
  store.profileLink = "";
  store.email = "";
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
</script>

<template>
  <h2>Faculty Table Rows</h2>
  <div class="gui-container">
    <section class="form-container">
      <h3>Edit Fields</h3>
      <div class="form">
        <button @click="clearFields">
          <i class="fa-solid fa-broom"></i>&nbsp;Clear All Fields
        </button>
        <div class="form-item">
          <h4>Name</h4>
          <input
            v-model="store.nameText"
            type="text"
            @paste="trimInput($event, 'nameText')"
            placeholder="Edit Name"
          />
        </div>

        <Titles />

        <Bullets />

        <div class="checkbox-container">
          <input id="checkbox" type="checkbox" v-model="store.disableURLs" />
          <h4>
            <label for="checkbox">Remove URLs from Row</label>
          </h4>
          <button @click="clearURLs">
            <i class="fa-solid fa-broom"></i>&nbsp;Clear URLs
          </button>
        </div>

        <div class="form-item">
          <h4 :class="{ disabled: store.disableURLs }">Profile URL</h4>
          <input
            v-model="store.profileLink"
            type="text"
            :disabled="store.disableURLs"
            @paste="trimInput($event, 'profileLink')"
            placeholder="Profile URL"
          />
        </div>

        <div class="form-item">
          <h4 :class="{ disabled: store.disableURLs }">Email URL</h4>
          <input
            v-model="store.email"
            type="text"
            :disabled="store.disableURLs"
            @paste="trimInput($event, 'email')"
            placeholder="Email URL"
          />
        </div>
      </div>
    </section>

    <Previews />
  </div>
</template>

<style>
.gui-container {
  display: grid;
  gap: 2.2rem;
  grid-template-columns: 35% 65%;
  position: relative;
}

.form-container {
  position: sticky;
  top: 1rem;
  align-self: start;
  min-width: 490px;
  box-shadow: 0px 0px 1.5px #cfcfcf;
  border-radius: 6px;
  padding: 0.8em;
  padding-bottom: 1em;
  background-color: #ffffff;
  overflow-y: hidden;

  :is(h3):first-of-type {
    margin-top: 0;
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  :is(input) {
    font-size: 1.1rem;
    max-width: 400px;
    padding: 0.2em;
    border: solid 2px #e2e2e6;
    border-radius: 6px;
    outline: none;
    &:focus-visible {
      border: solid 2px #9b9b9b;
    }
    &:disabled {
      cursor: not-allowed;
    }
  }

  :is(button) {
    max-width: fit-content;
    font-size: 1rem;
    padding: 0.2em;
    border: solid 2px #e4e4e7;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
    background-color: #e4e4e768;
    transition: background-color 0.3s;
    &:focus-visible {
      border: solid 2px #9b9b9b;
    }
  }
}

div.flex-container {
  display: flex;
  align-items: center;
}

.form-item {
  :is(h4) {
    margin-top: 0rem;
    margin-bottom: 0.5rem;
  }
  :is(input) {
    width: 100%;
  }

  .delete-button {
    margin-left: 0.5em;
    background-color: #ff5640;
    color: #ffffff;
    border: solid 2px transparent;
    padding-right: 0.4em;
    padding-left: 0.4em;
    max-height: 33px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
    &:hover {
      background-color: #d73d29;
    }
    &:focus-visible {
      border: solid 2px #8d2618;
    }
  }
}

.checkbox-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.4rem;
  :is(h4) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  :is(input) {
    margin: 0;
    margin-left: 0.15rem;
    transform: scale(1.3);
  }
  :is(button) {
    margin-left: 3.5rem;
  }
}

.disabled {
  color: #b4b4b4;
}

@media (max-width: 1490px) {
  .form-container {
    max-height: 645px;
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &:hover {
      overflow-y: scroll;
    }
  }
}
</style>
