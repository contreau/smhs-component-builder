<script setup lang="ts">
import { ref } from "vue";
import { store } from "../store";
import {
  facultyRow,
  facultyRowNoURL,
  facultyRowProfileOnly,
  facultyRowEmailOnly,
} from "../../ts/templates";
import {
  bulletRow,
  bulletRowNoURL,
  bulletRowProfileOnly,
  bulletRowEmailOnly,
} from "../../ts/bulleted-templates";
import saveSVG from "../../assets/save-svg.vue";
import codeSVG from "../../assets/code-svg.vue";
import idCardSVG from "../../assets/id-card-svg.vue";
import mailSVG from "../../assets/mail-svg.vue";

// css classes
const htmlTabActive = ref(false);

function toggleTabs() {
  if (htmlTabActive.value === false) {
    htmlTabActive.value = true;
  } else {
    htmlTabActive.value = false;
  }
}

async function copyHTML() {
  if (validateInputs()) {
    let row: any;
    if (store.disableProfileURL && store.disableEmailURL) {
      // if URLs are both toggled off
      if (store.enableBullets) {
        row = new bulletRowNoURL(
          store.nameText,
          store.titleText,
          store.bulletText,
          store.titles,
          store.bullets
        );
      } else {
        row = new facultyRowNoURL(
          store.nameText,
          store.titleText,
          store.titles
        );
      }
    } else if (store.disableProfileURL) {
      // profile URL is disabled
      if (store.enableBullets) {
        row = new bulletRowEmailOnly(
          store.nameText,
          store.titleText,
          store.bulletText,
          store.email,
          store.titles,
          store.bullets
        );
      } else {
        row = new facultyRowEmailOnly(
          store.nameText,
          store.titleText,
          store.email,
          store.titles
        );
      }
    } else if (store.disableEmailURL) {
      if (store.enableBullets) {
        row = new bulletRowProfileOnly(
          store.nameText,
          store.titleText,
          store.bulletText,
          store.profileLink,
          store.titles,
          store.bullets
        );
      } else {
        row = new facultyRowProfileOnly(
          store.nameText,
          store.titleText,
          store.profileLink,
          store.titles
        );
      }
    } else if (!store.disableProfileURL && !store.disableEmailURL) {
      // Both URLs are in use
      if (store.enableBullets) {
        row = new bulletRow(
          store.nameText,
          store.titleText,
          store.bulletText,
          store.profileLink,
          store.email,
          store.titles,
          store.bullets
        );
      } else {
        row = new facultyRow(
          store.nameText,
          store.titleText,
          store.profileLink,
          store.email,
          store.titles
        );
      }
    }

    await navigator.clipboard.writeText(row.html);
    store.copiedMessage = true;
    setTimeout(() => {
      store.copiedMessage = false;
    }, 1500);
  }
}

function validateInputs(): boolean {
  const requiredFieldsValues: Array<string | string[]> = [
    store.nameText,
    store.titleText,
  ];

  function showMissingFieldMessage() {
    const allInputFields: Array<HTMLInputElement> = Array.from(
      document.querySelectorAll("input")
    );
    for (let input of allInputFields) {
      if (input.value === "" && !input.disabled) {
        console.log(input);
        input.classList.add("invalid");
        setTimeout(() => {
          input.classList.remove("invalid");
        }, 2000);
      }
    }
    store.missingFieldMessage = true;
    setTimeout(() => {
      store.missingFieldMessage = false;
    }, 2000);
  }

  // conditionally build the requiredFieldsValues array
  if (store.titles.length > 0) {
    requiredFieldsValues.push(store.titles);
  }
  if (store.enableBullets) {
    requiredFieldsValues.push(store.bulletText);
    if (store.bullets.length > 0) {
      requiredFieldsValues.push(store.bullets);
    }
  }
  if (!store.disableProfileURL) {
    requiredFieldsValues.push(store.profileLink);
  }
  if (!store.disableEmailURL) {
    requiredFieldsValues.push(store.email);
  }

  // validate required fields
  if (store.invalidEmailMessage || store.invalidProfileURLMessage) {
    showMissingFieldMessage();
    return false;
  }

  let status: boolean = false;
  for (let field of requiredFieldsValues) {
    if (Array.isArray(field)) {
      for (let input of field) {
        if (input !== "") {
          status = true;
        } else {
          showMissingFieldMessage();
          return false;
        }
      }
    } else if (typeof field === "string" && field !== "") {
      status = true;
    } else {
      showMissingFieldMessage();
      return false;
    }
  }
  return status;
}
</script>

<template>
  <section class="preview">
    <div class="tabs">
      <h3 @click="toggleTabs">
        <span v-if="!htmlTabActive"
          ><codeSVG />&nbsp;&nbsp;Preview HTML &nbsp;</span
        >
        <span v-else><i class="fa-solid fa-eye"></i>&nbsp; Preview UI </span>
      </h3>
      <h3 @click="copyHTML">
        <span v-if="!store.copiedMessage"><saveSVG />&nbsp; Copy HTML</span>
        <span v-else>Copied!</span>
      </h3>
      <p :class="{ missingFields: store.missingFieldMessage }">
        Missing Fields.
      </p>
    </div>
    <div
      class="table-responsive"
      :class="{
        visible: !htmlTabActive,
        invisible: htmlTabActive,
      }"
    >
      <table class="table table-hover table-faculty">
        <tbody>
          <tr>
            <td>
              <div class="picture-frame">
                <div class="field--type-image">
                  <img
                    class="img-responsive"
                    loading="lazy"
                    src="/avatar-headshot--200x245.jpg"
                    width="200"
                    height="245"
                    alt="Avatar wearing GW white coat"
                    typeof="foaf:Image"
                  />
                </div>
              </div>
            </td>
            <td>
              <div class="faculty-info">
                <p class="mdbluetext">
                  <a
                    v-if="!store.disableProfileURL"
                    :href="store.profileLink"
                    target="_blank"
                    >{{ store.nameText }}</a
                  >
                  <span v-if="store.disableProfileURL">{{
                    store.nameText
                  }}</span>
                </p>
                <p class="highlighted-text">
                  {{ store.titleText }}
                  <!-- Generated Titles -->
                  <span v-for="item in store.titles">
                    <br />
                    {{ item }}
                  </span>
                </p>

                <ul v-if="store.enableBullets">
                  <li>{{ store.bulletText }}</li>
                  <li v-for="bullet in store.bullets">{{ bullet }}</li>
                </ul>

                <div class="faculty-icon--container">
                  <a
                    :href="store.profileLink"
                    target="_blank"
                    aria-label="View faculty profile"
                    role="button"
                    v-if="!store.disableProfileURL"
                    ><span class="faculty-icon--color"><idCardSVG /></span
                  ></a>
                </div>
                <div class="faculty-icon--container">
                  <a
                    :href="store.email"
                    target="_blank"
                    aria-label="Send email"
                    role="button"
                    v-if="!store.disableEmailURL"
                    ><span class="faculty-icon--color"><mailSVG /></span
                  ></a>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="image-note" v-if="!htmlTabActive">
      Image dimensions <strong>must be</strong> 200x245 at 72dpi.
    </p>

    <!-- HTML Preview -->
    <div
      class="html-display-container"
      :class="{
        visible: htmlTabActive,
        invisible: !htmlTabActive,
      }"
    >
      <code>
        <div>&lt;tr&gt;</div>
        <div class="ind-1">&lt;td&gt;</div>
        <div class="ind-2">&lt;div class="picture-frame"&gt;</div>
        <span v-if="!store.disableProfileURL"
          ><div class="ind-3">
            &lt;a href="<span class="input-text">{{ store.profileLink }}</span
            >" target="_blank"&gt;
          </div></span
        >
        <div class="ind-3">&lt;div class="field--type-image"&gt;</div>
        <div class="ind-4">
          &lt;img class="img-responsive" loading="lazy" src="/path/to/image"
          <div class="ind-5">
            width="200" height="245" alt="Avatar wearing GW white coat"
          </div>
          <div class="ind-5">typeof="foaf:Image"</div>
          <div class="ind-4">/&gt;</div>
        </div>
        <div class="ind-3">&lt;/div&gt;</div>
        <div v-if="!store.disableProfileURL" class="ind-3">&lt;/a&gt;</div>
        <div class="ind-2">&lt;/div&gt;</div>
        <div class="ind-1">&lt;/td&gt;</div>
        <div class="ind-1">&lt;td&gt;</div>
        <div class="ind-2">&lt;div class="faculty-info"&gt;</div>
        <div class="ind-3">&lt;p class="mdbluetext"&gt;</div>
        <div class="ind-4">
          <span v-if="!store.disableProfileURL"
            >&lt;a href="<span class="input-text">{{ store.profileLink }}</span
            >" target="_blank"&gt;<span class="input-text">{{
              store.nameText
            }}</span
            >&lt;/a&gt;</span
          >
        </div>
        <div class="ind-4">
          <span v-if="store.disableProfileURL" class="input-text">{{
            store.nameText
          }}</span>
        </div>
        <div class="ind-3">&lt;/p&gt;</div>
        <div class="ind-3">
          &lt;p class="highlighted-text"&gt;
          <div class="ind-4">
            <span class="input-text">{{ store.titleText }}</span>
          </div>
        </div>
        <span v-for="item in store.titles">
          <div class="ind-4">
            &lt;br /&gt;
            <div class="ind-4 input-text">{{ item }}</div>
          </div>
        </span>
        <div class="ind-3">&lt;/p&gt;</div>

        <!-- Bulleted List -->
        <span v-if="store.enableBullets">
          <div class="ind-3">&lt;ul&gt;</div>
          <div class="ind-4">
            &lt;li&gt;<span class="input-text">{{ store.bulletText }}</span
            >&lt;/li&gt;
          </div>
          <span v-for="item in store.bullets">
            <div class="ind-4">
              &lt;li&gt;<span class="input-text">{{ item }}</span
              >&lt;/li&gt;
            </div>
          </span>
          <div class="ind-3">&lt;/ul&gt;</div>
        </span>

        <!-- URL Inputs -->
        <span v-if="!store.disableProfileURL"
          ><div class="ind-3">&lt;div class="faculty-icon--container"&gt;</div>
          <div class="ind-4">&lt;a</div>
          <div class="ind-5">
            href="<span class="input-text">{{ store.profileLink }}</span
            >"
          </div>
          <div class="ind-5">target="_blank"</div>
          <div class="ind-5">aria-label="View faculty profile"</div>
          <div class="ind-5">role="button"&gt;</div>
          <div class="ind-6">&lt;span class="faculty-icon--color"&gt;</div>
          <div class="ind-7">&lt;span class="fontawesome-icon-inline"&gt;</div>
          <div class="ind-8">
            &lt;span class="fa-sharp fa-regular fa-address-card fa-lg"&gt;
          </div>
          <div class="ind-8">&lt;/span&gt;</div>
          <div class="ind-7">
            &lt;/span&gt;
            <div class="ind-6">&lt;/span&gt;</div>
          </div>
          <div class="ind-4">
            &lt;/a&gt;
            <div class="ind-3">&lt;/div&gt;</div>
          </div></span
        >
        <span v-if="!store.disableEmailURL"
          ><div class="ind-3">&lt;div class="faculty-icon--container"&gt;</div>
          <div class="ind-4">&lt;a</div>
          <div class="ind-5">
            href="<span class="input-text">{{ store.email }}</span
            >"
          </div>
          <div class="ind-5">target="_blank"</div>
          <div class="ind-5">aria-label="Send email"</div>
          <div class="ind-5">role="button"&gt;</div>
          <div class="ind-6">&lt;span class="faculty-icon--color"&gt;</div>
          <div class="ind-7">&lt;span class="fontawesome-icon-inline"&gt;</div>
          <div class="ind-8">
            &lt;span class="fa-sharp fa-regular fa-envelope fa-lg"&gt;
          </div>
          <div class="ind-8">&lt;/span&gt;</div>
          <div class="ind-7">&lt;/span&gt;</div>
          <div class="ind-6">&lt;/span&gt;</div>
          <div class="ind-4">&lt;/a&gt;</div>
          <div class="ind-3">&lt;/div&gt;</div></span
        >
        <div class="ind-2">&lt;/div&gt;</div>
        <div class="ind-1">&lt;/td&gt;</div>
        &lt;/tr&gt;
      </code>
    </div>
  </section>
</template>

<style scoped>
section.preview {
  max-width: 860px;
}

.visible {
  display: block;
}
.invisible {
  display: none;
}

.ind-1 {
  text-indent: 1rem;
}

.ind-2 {
  text-indent: 2rem;
}

.ind-3 {
  text-indent: 3rem;
}

.ind-4 {
  text-indent: 4rem;
}

.ind-5 {
  text-indent: 5rem;
}

.ind-6 {
  text-indent: 6rem;
}

.ind-7 {
  text-indent: 7rem;
}

.ind-8 {
  text-indent: 8rem;
}

.html-display-container {
  background-color: var(--white);
  padding: 0.5em;
  border-radius: 6px;
  box-shadow: 0px 0px 1.5px var(--form-shadow);
  margin-bottom: 1rem;
}

.image-note {
  margin: 0;
  padding: 0.3em 0.5em;
  font-weight: 500;
  max-width: fit-content;
  background-color: var(--white);
  border-radius: 6px;
  box-shadow: 0px 0px 1.5px var(--form-shadow);
}

.input-text {
  font-weight: 800;
  color: var(--blue);
}

.tabs {
  display: flex;
  align-items: flex-start;
  gap: 3rem;

  :is(p) {
    margin-top: 0;
    font-size: 1.25rem;
    border-radius: 6px;
    color: var(--white);
    background-color: var(--red);
    padding: 0.4em;
    transition: opacity 0.3s;
    opacity: 0;
  }

  .missingFields {
    opacity: 1;
  }

  :is(h3) {
    margin-top: 0;
    padding: 0.4em;
    cursor: pointer;
    background-color: var(--white);
    transition: 0.3s all;
    font-weight: 400;
    text-align: center;
    border: solid 1.5px #e9e9eb;
    border-radius: 6px;
    transition: 0.3s all;
    &:hover {
      background-color: #d6d6d6;
    }

    &:first-of-type {
      min-width: 207px;
    }

    &:nth-of-type(2) {
      min-width: 151px;
    }

    :is(svg) {
      vertical-align: -5px;
    }
  }
}

.faculty-icon--color {
  :is(svg) {
    vertical-align: -7px;
  }
}
</style>
