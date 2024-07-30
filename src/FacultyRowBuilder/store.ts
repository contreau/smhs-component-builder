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
  disableURLs: false,
  enableBullets: false,
});
