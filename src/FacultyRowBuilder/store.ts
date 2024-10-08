import { reactive } from "vue";

export const store = reactive({
  titles: <string[]>[],
  bullets: <string[]>[],
  titleText: "",
  nameText: "",
  profileLink: "",
  email: "",
  bulletText: "",
  remainingTitles: 4,
  remainingBullets: 4,
  copiedMessage: false,
  missingFieldMessage: false,
  invalidProfileURLMessage: false,
  invalidEmailMessage: false,
  disableProfileURL: false,
  disableEmailURL: false,
  enableBullets: false,
});
