<script setup lang="ts">
import { store } from "../store";
import { nextTick } from "vue";
import Titles from "./Titles.vue";
import Bullets from "./Bullets.vue";
import Previews from "./Previews.vue";
import broomSVG from "../../assets/broom-svg.vue";
import resetSVG from "../../assets/reset-svg.vue";
import hideSVG from "../../assets/hide-svg.vue";

// TODO:
// Modify validateInput() / store to highlight the inputs in red that have invalid input upon clicking the copy button
// Refactor copyHTML function in Previews.vue?
// Restyle + make bulleted input have same key controls as titles
// style adjustments as seen fit

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
  store.disableProfileURL = false;
  store.disableEmailURL = false;
  store.invalidProfileURLMessage = false;
  store.invalidEmailMessage = false;
}

function clearURLs(urlType: string) {
  if (urlType === "profile") {
    store.profileLink = "";
    store.invalidProfileURLMessage = false;
  } else if (urlType === "email") {
    store.email = "";
    store.invalidEmailMessage = false;
  }
}

function toggleURLDisplay(urlType: string) {
  if (urlType === "profile") {
    store.disableProfileURL = !store.disableProfileURL;
  } else if (urlType === "email") {
    store.disableEmailURL = !store.disableEmailURL;
  }
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
            <resetSVG />&nbsp;Reset All Fields
          </button>
        </div>
        <div class="form-group">
          <div class="form-item form-row">
            <h4>Name</h4>
            <input
              v-model.trim="store.nameText"
              type="text"
              placeholder="Edit Name"
            />
          </div>
          <Titles />

          <div class="form-item form-row">
            <h4 class="url-item" :class="{ disabled: store.disableProfileURL }">
              Profile URL
              <span
                class="invalid-url-message"
                :class="{ fadeIn: store.invalidProfileURLMessage }"
                >Invalid URL.</span
              >
            </h4>
            <div class="url-input-block">
              <input
                :class="{ invalid: store.invalidProfileURLMessage }"
                v-model.trim="store.profileLink"
                type="text"
                :disabled="store.disableProfileURL"
                @paste="formatProfileURL($event)"
                @keyup="formatProfileURL($event)"
                placeholder="Profile URL"
              />
              <button class="clear-url" @click="clearURLs('profile')">
                <broomSVG />
              </button>
              <button
                class="hide"
                :class="{ active: store.disableProfileURL }"
                @click="toggleURLDisplay('profile')"
              >
                <hideSVG />
              </button>
            </div>
          </div>
          <div class="form-item form-row">
            <h4 class="url-item" :class="{ disabled: store.disableEmailURL }">
              Email or Contact URL
              <span
                class="invalid-url-message"
                :class="{ fadeIn: store.invalidEmailMessage }"
                >Invalid URL.</span
              >
            </h4>
            <div class="url-input-block">
              <input
                :class="{ invalid: store.invalidEmailMessage }"
                v-model.trim="store.email"
                type="text"
                :disabled="store.disableEmailURL"
                @paste="formatEmail($event)"
                @keyup="formatEmail($event)"
                placeholder="Email URL"
              />
              <button class="clear-url" @click="clearURLs('email')">
                <broomSVG />
              </button>
              <button
                class="hide"
                :class="{ active: store.disableEmailURL }"
                @click="toggleURLDisplay('email')"
              >
                <hideSVG />
              </button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <Bullets />
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
    font-size: 1.6rem;
    font-weight: 900;
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

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

  :is(input.invalid) {
    border-color: #ff5640;
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

  .url-input-block {
    display: flex;
    gap: 1rem;
    :is(button) {
      padding: 0.2em 0.35em 0.05em 0.35em;
      border: solid 2px transparent;
    }
    :is(button).clear-url {
      border: solid 2px #cfcfd5;
      &:hover,
      &:focus {
        background-color: #d7d6d6;
      }
    }
    :is(button).hide {
      :is(path) {
        stroke: #000000;
      }
      border: solid 3px #afafbc;
      transition: border-color 0.1s;
      &:hover,
      &:focus {
        border-color: #79797e;
      }
    }
    :is(button).hide.active {
      :is(path) {
        stroke: #ffffff;
      }
      background-color: #005fd7;
      border: solid 3px transparent;
    }
  }
}

button.clear-button {
  background-color: #005fd7;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 400;
  border: solid 2px transparent;
  &:hover {
    background-color: #013c85;
  }
  &:focus-visible {
    border: solid 2px #000000;
  }
  :is(svg) {
    vertical-align: -5px;
  }
}

div.flex-container {
  display: flex;
  align-items: center;
}

.form-row {
  margin: 0.65rem 0;
}

.form-item {
  :is(h4) {
    color: #0051b3;
    font-size: 1.3rem;
    font-weight: 550;
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
    font-weight: 500;
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
  :is(div) {
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
