<script setup lang="ts">
import { store } from "../store";
import { nextTick } from "vue";
import Titles from "./Titles.vue";
import Bullets from "./Bullets.vue";
import Previews from "./Previews.vue";
import broomSVG from "../../assets/broom-svg.vue";

// TODO:
// Remove 'Clear URL Fields' button and put a 'Clear Input' button (maybe just use broom icon) next to each URL input
// Add toggle to disable just email or just profile urls
// Restyle + make bulleted input have same key controls as titles
// ... that should be it for core functionality, then just style adjustments - like subtle section differentiation in the input box

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

function isValidURL(url: string): boolean {
  const validProtocols = ["http:", "https:", "mailto:"];
  try {
    const parsedURL = new URL(url);
    return validProtocols.includes(parsedURL.protocol);
  } catch {
    return false;
  }
}

function formatProfileURL(event: Event) {
  const target = event.target as HTMLInputElement;
  nextTick(() => {
    const inputValue = target.value.trim();
    if (isValidURL(inputValue)) {
      store.profileLink = inputValue;
      store.invalidProfileURLMessage = false;
    } else if (inputValue === "") {
      store.profileLink = inputValue;
      store.invalidProfileURLMessage = false;
    } else {
      store.invalidProfileURLMessage = true;
    }
  });
}

function formatEmail(event: Event) {
  const target = event.target as HTMLInputElement;
  nextTick(() => {
    const inputValue = target.value.trim();
    if (isValidURL(inputValue)) {
      store.email = inputValue;
      store.invalidEmailMessage = false;
    } else if (inputValue === "") {
      store.email = inputValue;
      store.invalidEmailMessage = false;
    } else if (inputValue.includes("@")) {
      store.email = "mailto:" + inputValue;
    } else {
      store.invalidEmailMessage = true;
    }
  });
}
</script>

<template>
  <section class="component-wrapper">
    <div class="gui-container">
      <section class="form-container">
        <div class="form-top">
          <h3>Edit Fields</h3>
          <button class="clear-button" @click="clearFields">
            <broomSVG />&nbsp;Clear All Fields
          </button>
        </div>
        <div class="form">
          <div class="form-item">
            <h4>Name</h4>
            <input
              v-model.trim="store.nameText"
              type="text"
              placeholder="Edit Name"
            />
          </div>
          <Titles />
          <Bullets />
          <div class="checkbox-container url-checkboxes">
            <div>
              <input
                id="checkbox"
                type="checkbox"
                v-model="store.disableURLs"
              />
              <h4>
                <label for="checkbox">Remove URLs from Row</label>
              </h4>
            </div>
            <button class="clear-button" @click="clearURLs">
              <broomSVG />&nbsp;Clear URL Fields
            </button>
          </div>
          <div class="form-item">
            <h4 class="url-item" :class="{ disabled: store.disableURLs }">
              Profile URL
              <span
                class="invalid-url-message"
                :class="{ fadeIn: store.invalidProfileURLMessage }"
                >Invalid URL.</span
              >
            </h4>
            <input
              v-model.trim="store.profileLink"
              type="text"
              :disabled="store.disableURLs"
              @paste="formatProfileURL($event)"
              @keyup="formatProfileURL($event)"
              placeholder="Profile URL"
            />
          </div>
          <div class="form-item">
            <h4 class="url-item" :class="{ disabled: store.disableURLs }">
              Email or Contact URL
              <span
                class="invalid-url-message"
                :class="{ fadeIn: store.invalidEmailMessage }"
                >Invalid URL.</span
              >
            </h4>
            <input
              v-model.trim="store.email"
              type="text"
              :disabled="store.disableURLs"
              @paste="formatEmail($event)"
              @keyup="formatEmail($event)"
              placeholder="Email URL"
            />
          </div>
        </div>
      </section>
      <Previews />
    </div>
  </section>
</template>

<style>
.component-wrapper {
  padding: 0 1.5em;
}

.gui-container {
  margin-top: 2rem;
  display: grid;
  gap: 2.2rem;
  grid-template-columns: 39% 59%;
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
}

.form-top {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  justify-content: space-between;

  :is(h3):first-of-type {
    margin-top: 0;
    margin-bottom: 0;
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

button.clear-button {
  background-color: #005fd7;
  color: #ffffff;
  border: solid 2px transparent;
  &:hover {
    background-color: #013c85;
  }
  &:focus-visible {
    border: solid 2px #000000;
  }
  svg {
    vertical-align: -6px;
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
  :is(h4).url-item {
    max-width: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

.url-checkboxes {
  justify-content: space-between;
  div {
    display: flex;
    gap: 0.5rem;
  }
}

.disabled {
  color: #b4b4b4;
}

.invalid-url-message {
  color: #ffffff;
  background-color: #ff5640;
  padding: 0.1em;
  font-weight: 400;
  padding: 0.1em 0.4em;
  border-radius: 6px;
  margin-left: 3rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.fadeIn {
  opacity: 1;
  transition: opacity 0.3s;
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
