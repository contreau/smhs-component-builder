<script setup lang="ts">
import { ref, reactive, Ref } from "vue";
import { facultyRow, facultyRowNoURL } from "../ts/templates";
const titleText = ref("");
const nameText = ref("");
const profileLink = ref("");
const email = ref("");
const remainingTitles = ref(4);
const copiedMessage = ref(false);
const missingFieldMessage = ref(false);
const disableURLs = ref(false);
const store = reactive({
  titles: <string[]>[],
});

// TODO: consider adding toggle for direct email or email url (and find out how to hide the little envelope icon in smhs sites)

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
    let row: any;
    if (disableURLs.value) {
      row = new facultyRowNoURL(nameText, titleText, store.titles);
    } else {
      row = new facultyRow(
        nameText,
        titleText,
        profileLink,
        email,
        store.titles
      );
    }

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
  disableURLs.value = false;
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
  let states: Ref[] = [];
  if (disableURLs.value) {
    states = [nameText, titleText];
  } else if (!disableURLs.value) {
    states = [nameText, titleText, profileLink, email];
  }

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
  <h2>Faculty Table Rows</h2>
  <div class="gui-container">
    <section class="form-container">
      <h3>Edit Fields</h3>
      <div class="form">
        <button @click="clearFields">
          <i class="fa-solid fa-broom"></i>&nbsp;Reset All Fields
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

        <div class="url-toggle-container">
          <input id="checkbox" type="checkbox" v-model="disableURLs" />
          <h4>
            <label for="checkbox">Remove URLs from Row</label>
          </h4>
        </div>

        <div class="form-item">
          <h4 :class="{ disabled: disableURLs }">Profile URL</h4>
          <input
            v-model="profileLink"
            type="text"
            :disabled="disableURLs"
            @paste="trimInput($event, 'profileLink')"
            placeholder="Profile URL"
          />
        </div>

        <div class="form-item">
          <h4 :class="{ disabled: disableURLs }">Email URL</h4>
          <input
            v-model="email"
            type="text"
            :disabled="disableURLs"
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
                    <a
                      v-if="!disableURLs"
                      :href="profileLink"
                      target="_blank"
                      >{{ nameText }}</a
                    >
                    <span v-if="disableURLs">{{ nameText }}</span>
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
                      v-if="!disableURLs"
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
                      v-if="!disableURLs"
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
          <div class="ind-3">&lt;div class="field--type-image"&gt;</div>
          <div class="ind-4">
            &lt;img class="img-responsive" loading="lazy" src="/path/to/image"
            <div class="ind-5">
              width="200" height="245" alt="Avatar wearing GW white coat"
            </div>
            <div class="ind-5">typeof="foaf:Image"</div>
            <div class="in-4">/&gt;</div>
          </div>
          <div class="ind-3">&lt;/div&gt;</div>
          <div class="ind-2">&lt;/div&gt;</div>
          <div class="ind-1">&lt;/td&gt;</div>
          <div class="ind-1">&lt;td&gt;</div>
          <div class="ind-2">&lt;div class="faculty-info"&gt;</div>
          <div class="ind-3">&lt;p class="mdbluetext"&gt;</div>
          <div class="ind-4">
            <span v-if="!disableURLs"
              >&lt;a href="<span class="input-text">{{ profileLink }}</span
              >" target="_blank"&gt;<span class="input-text">{{
                nameText
              }}</span
              >&lt;/a&gt;</span
            >
          </div>
          <div class="ind-4">
            <span v-if="disableURLs" class="input-text">{{ nameText }}</span>
          </div>
          <div class="ind-3">&lt;/p&gt;</div>
          <div class="ind-3">
            &lt;p class="highlighted-text"&gt;
            <div class="ind-4">
              <span class="input-text">{{ titleText }}</span>
            </div>
          </div>
          <span v-for="item in store.titles">
            <div class="ind-4">
              &lt;br /&gt;
              <div class="ind-4 input-text">{{ item }}</div>
            </div>
          </span>
          <div class="ind-3">&lt;/p&gt;</div>
          <span v-if="!disableURLs"
            ><div class="ind-3">
              &lt;div class="faculty-icon--container"&gt;
            </div>
            <div class="ind-4">&lt;a</div>
            <div class="ind-5">
              href="<span class="input-text">{{ profileLink }}</span
              >"
            </div>
            <div class="ind-5">target="_blank"</div>
            <div class="ind-5">aria-label="View faculty profile"</div>
            <div class="ind-5">role="button"&gt;</div>
            <div class="ind-6">&lt;span class="faculty-icon--color"&gt;</div>
            <div class="ind-7">
              &lt;span class="fontawesome-icon-inline"&gt;
            </div>
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
          <span v-if="!disableURLs"
            ><div class="ind-3">
              &lt;div class="faculty-icon--container"&gt;
            </div>
            <div class="ind-4">&lt;a</div>
            <div class="ind-5">
              href="<span class="input-text">{{ email }}</span
              >"
            </div>
            <div class="ind-5">target="_blank"</div>
            <div class="ind-5">aria-label="Send email"</div>
            <div class="ind-5">role="button"&gt;</div>
            <div class="ind-6">&lt;span class="faculty-icon--color"&gt;</div>
            <div class="ind-7">
              &lt;span class="fontawesome-icon-inline"&gt;
            </div>
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
  </div>
</template>

<style scoped>
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

.image-note {
  margin: 0;
  padding: 0.3em 0.5em;
  font-weight: 500;
  max-width: fit-content;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0px 0px 1.5px #cfcfcf;
}

.input-text {
  font-weight: 800;
  color: #348eff;
}

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
      min-width: 207px;
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

.url-toggle-container {
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
}

.disabled {
  color: #b4b4b4;
}

section.preview {
  max-width: 860px;
}

.html-display-container {
  background-color: #ffffff;
  padding: 0.5em;
  border-radius: 6px;
  box-shadow: 0px 0px 1.5px #cfcfcf;
  margin-bottom: 1rem;
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
