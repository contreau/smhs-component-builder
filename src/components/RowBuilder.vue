<script setup lang="ts">
import { ref, reactive, Ref } from "vue";
const titleText = ref("");
const nameText = ref("");
const profileLink = ref("");
const email = ref("");
const remainingTitles = ref(4);
const copiedMessage = ref(false);
const missingFieldMessage = ref(false);
const store = reactive({
  titles: <string[]>[],
});

// TODO: Highlight inserted HTML with some color

class facultyRow {
  html: string;
  titles: string;
  constructor(storedTitles: string[]) {
    let titles = storedTitles.slice();
    let titleString = "";
    if (titles.length >= 1) {
      for (let i = 0; i < titles.length; i++) {
        if (i === 0) {
          titles[i] = "<br>" + titles[i];
        }
        if (i !== titles.length - 1) {
          titles[i] = titles[i] + "<br>";
        }
      }
    }
    for (let title of titles) {
      titleString += title;
    }
    this.titles = titleString;
    this.html = `
    <tr>
      <td>
        <div class="picture-frame">
          <div class="field--type-image">
            <img
              class="img-responsive"
              loading="lazy"
              src="https://smhs.gwu.edu/sites/g/files/zaskib1151/files/styles/1920_x_variable/public/2024-04/avatar-headshot--200x245.jpg?itok=_5durzkz"
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
            <a href="${profileLink.value}" target="_blank">${nameText.value}</a>
          </p>
          <p class="highlighted-text">${titleText.value + this.titles}</p>
          <div class="faculty-icon--container">
            <a
              href="${profileLink.value}"
              target="_blank"
              aria-label="View faculty profile"
              role="button"
              ><span class="faculty-icon--color"
                ><span class="fontawesome-icon-inline"
                  ><span class="fa-sharp fa-regular fa-address-card fa-lg">
                  </span> </span></span
            ></a>
          </div>
          <div class="faculty-icon--container">
            <a
              href="${email.value}"
              target="_blank"
              aria-label="Send email"
              role="button"
              ><span class="faculty-icon--color"
                ><span class="fontawesome-icon-inline"
                  ><span class="fa-sharp fa-regular fa-envelope fa-lg">
                  </span> </span></span
            ></a>
          </div>
        </div>
      </td>
    </tr>
    `;
  }
}

// css classes
const htmlTabActive = ref(false);

// functions
function toggleTabs() {
  if (htmlTabActive.value === false) {
    htmlTabActive.value = true;
  } else {
    htmlTabActive.value = false;
  }
}

function createAdditionalTitles() {
  if (remainingTitles.value < 5 && remainingTitles.value > 0) {
    store.titles.push("");
    remainingTitles.value--;
  }
}

function deleteTitle(titleIndex: number) {
  store.titles.splice(titleIndex, 1);
  remainingTitles.value++;
}

async function copyHTML() {
  if (validateInputs()) {
    const row = new facultyRow(store.titles);
    await navigator.clipboard.writeText(row.html);
    copiedMessage.value = true;
    setTimeout(() => {
      copiedMessage.value = false;
    }, 1500);
  }
}

function clearFields() {
  titleText.value = "";
  nameText.value = "";
  profileLink.value = "";
  email.value = "";
  remainingTitles.value = 4;
  store.titles = [];
}

function trimInput(event: Event, state: string) {
  const refs: Record<string, Ref> = {
    nameText: nameText,
    titleText: titleText,
    profileLink: profileLink,
    email: email,
  };
  setTimeout(() => {
    const target = event.target as HTMLInputElement;
    refs[state].value = target.value.trim();
  }, 0);
}

function trimTitlesInput(event: Event, index: number) {
  const target = event.target as HTMLInputElement;
  setTimeout(() => {
    store.titles[index] = target.value.trim();
  }, 0);
}

function validateInputs(): boolean {
  const states: Ref[] = [nameText, titleText, profileLink, email];
  let status = false;
  if (store.titles.length > 0) {
    // check extra titles
    for (let title of store.titles) {
      if (title !== "") {
        status = true;
      } else {
        missingFieldMessage.value = true;
        setTimeout(() => {
          missingFieldMessage.value = false;
        }, 1200);
        return false;
      }
    }
  }
  // check all default inputs
  for (let state of states) {
    if (state.value !== "") {
      status = true;
    } else {
      missingFieldMessage.value = true;
      setTimeout(() => {
        missingFieldMessage.value = false;
      }, 1200);
      return false;
    }
  }
  return true ? status : false;
}
</script>

<template>
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
            v-model="nameText"
            type="text"
            @paste="trimInput($event, 'nameText')"
            placeholder="Edit Name"
          />
        </div>

        <div class="form-item">
          <h4>Title</h4>
          <input
            v-model="titleText"
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
          v-if="remainingTitles > 0"
          class="btn-addTitle"
          @click="createAdditionalTitles"
        >
          <i class="fa-solid fa-plus"></i> Add Title (
          {{ remainingTitles }} remaining )
        </button>

        <div class="form-item">
          <h4>Profile URL</h4>
          <input
            v-model="profileLink"
            type="text"
            @paste="trimInput($event, 'profileLink')"
            placeholder="Profile URL"
          />
        </div>

        <div class="form-item">
          <h4>Email URL</h4>
          <input
            v-model="email"
            type="text"
            @paste="trimInput($event, 'email')"
            placeholder="Email URL"
          />
        </div>
      </div>
    </section>

    <!-- Preview -->
    <section class="preview">
      <div class="tabs">
        <h3 @click="toggleTabs">
          <span v-if="!htmlTabActive"
            ><i class="fa-solid fa-code"></i>&nbsp;&nbsp;Preview HTML
            &nbsp;</span
          >
          <span v-else><i class="fa-solid fa-eye"></i>&nbsp; Preview UI </span>
        </h3>
        <h3 @click="copyHTML">
          <span v-if="!copiedMessage"
            ><i class="fa-regular fa-floppy-disk"></i>&nbsp; Copy HTML</span
          >
          <span v-else>Copied!</span>
        </h3>
        <p :class="{ missingFields: missingFieldMessage }">Missing Fields.</p>
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
                      src="https://smhs.gwu.edu/sites/g/files/zaskib1151/files/styles/1920_x_variable/public/2024-04/avatar-headshot--200x245.jpg?itok=_5durzkz"
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
                    <a :href="profileLink" target="_blank">{{ nameText }}</a>
                  </p>
                  <p class="highlighted-text">
                    {{ titleText }}
                    <!-- Generated Titles -->
                    <span v-for="item in store.titles">
                      <br />
                      {{ item }}
                    </span>
                  </p>

                  <div class="faculty-icon--container">
                    <a
                      :href="profileLink"
                      target="_blank"
                      aria-label="View faculty profile"
                      role="button"
                      ><span class="faculty-icon--color"
                        ><span class="fontawesome-icon-inline"
                          ><span
                            class="fa-sharp fa-regular fa-address-card fa-lg"
                          >
                          </span> </span></span
                    ></a>
                  </div>
                  <div class="faculty-icon--container">
                    <a
                      :href="email"
                      target="_blank"
                      aria-label="Send email"
                      role="button"
                      ><span class="faculty-icon--color"
                        ><span class="fontawesome-icon-inline"
                          ><span class="fa-sharp fa-regular fa-envelope fa-lg">
                          </span> </span></span
                    ></a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- HTML Preview -->
      <div
        class="html-display-container"
        :class="{
          visible: htmlTabActive,
          invisible: !htmlTabActive,
        }"
      >
        <code>
          &lt;tr&gt;<br />
          &nbsp;&nbsp;&lt;td&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;div class="picture-frame"&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;div
          class="field--type-image"&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;img
          class="img-responsive" loading="lazy" src="/path/to/image"
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;width="200"
          height="245" alt="Avatar wearing GW white coat"
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;typeof="foaf:Image"
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
          &nbsp;&nbsp;&lt;/td&gt;<br />
          &nbsp;&nbsp;&lt;td&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;div class="faculty-info"&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;p class="mdbluetext"&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;a href="<span>{{
            profileLink
          }}</span
          >" target="_blank"&gt;<span>{{ nameText }}</span
          >&lt;/a&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/p&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;p
          class="highlighted-text"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span
            >{{ titleText }}</span
          ><span v-for="item in store.titles">
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;br /&gt;
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item }} </span
          ><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/p&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;div
          class="faculty-icon--container"&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;a
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;href="<span
            >{{ profileLink }}</span
          >"<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target="_blank"<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aria-label="View
          faculty profile"
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role="button"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;span
          class="faculty-icon--color"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;span
          class="fontawesome-icon-inline"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;span
          class="fa-sharp fa-regular fa-address-card fa-lg"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt;
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/a&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;div
          class="faculty-icon--container"&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;a<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;href="<span
            >{{ email }}</span
          >"
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target="_blank"<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aria-label="Send
          email"<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role="button"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;span
          class="faculty-icon--color"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;span
          class="fontawesome-icon-inline"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;span
          class="fa-sharp fa-regular fa-envelope fa-lg"&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/a&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
          &nbsp;&nbsp;&lt;/td&gt;<br />
          &lt;/tr&gt;
        </code>
      </div>
    </section>
  </div>
</template>

<style scoped>
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

.tabs {
  display: flex;
  align-items: flex-start;
  gap: 3rem;

  :is(p) {
    margin-top: 0;
    font-size: 1.25rem;
    border-radius: 6px;
    color: #ffffff;
    background-color: #ff5640;
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
    background-color: #ffffff;
    transition: 0.3s all;
    font-weight: 400;
    text-align: center;
    border: solid 1.5px #e2e2e6;
    border-radius: 6px;
    transition: 0.3s all;
    &:hover {
      background-color: #e4e4e768;
    }

    &:first-of-type {
      min-width: 191px;
    }

    &:nth-of-type(2) {
      min-width: 151px;
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
    border-radius: 50%;
    padding: 0.15em 0.4em;
    font-size: 1.1rem;
    font-weight: 800;
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

section.preview {
  max-width: 860px;
}

.html-display-container {
  background-color: #ffffff;
  padding: 0.5em;
  border-radius: 6px;
  box-shadow: 0px 0px 1.5px #cfcfcf;
}

.visible {
  display: block;
}
.invisible {
  display: none;
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
