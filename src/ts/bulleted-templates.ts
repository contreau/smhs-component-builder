export class bulletRow {
  html: string;
  titles: string;
  bullets: string;
  bulletText: string;
  nameText: string;
  titleText: string;
  profileLink: string;
  email: string;

  constructor(
    nameText: string,
    titleText: string,
    bulletText: string,
    profileLink: string,
    email: string,
    storedTitles: string[],
    storedBullets: string[]
  ) {
    // Title formatting
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

    // Bullet formatting
    let bullets = storedBullets.slice();
    let bulletString = `<li>${bulletText}</li>\n`;
    for (let bullet of bullets) {
      bulletString += `<li>${bullet}</li>\n`;
    }

    this.nameText = nameText;
    this.titleText = titleText;
    this.bulletText = bulletText;
    this.bullets = bulletString;
    this.profileLink = profileLink;
    this.email = email;
    this.titles = titleString;
    this.html = `
        <tr>
          <td>
            <div class="picture-frame">
              <a href="${this.profileLink}" target="_blank">
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
              </a>
            </div>
          </td>
          <td>
            <div class="faculty-info">
              <p class="mdbluetext">
                <a href="${this.profileLink}" target="_blank">${
      this.nameText
    }</a>
              </p>
              <p class="highlighted-text">${this.titleText + this.titles}</p>
              <ul>
                ${this.bullets}
              </ul>
              <div class="faculty-icon--container">
                <a
                  href="${this.profileLink}"
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
                  href="${this.email}"
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

export class bulletRowNoURL {
  html: string;
  titles: string;
  bullets: string;
  bulletText: string;
  nameText: string;
  titleText: string;
  constructor(
    nameText: string,
    titleText: string,
    bulletText: string,
    storedTitles: string[],
    storedBullets: string[]
  ) {
    // Title formatting
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

    // Bullet formatting
    let bullets = storedBullets.slice();
    let bulletString = `<li>${bulletText}</li>\n`;
    for (let bullet of bullets) {
      bulletString += `<li>${bullet}</li>\n`;
    }

    this.nameText = nameText;
    this.titleText = titleText;
    this.bulletText = bulletText;
    this.bullets = bulletString;
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
                  ${this.nameText}
                </p>
                <p class="highlighted-text">${this.titleText + this.titles}</p>
                <ul>
                  ${this.bullets}
                </ul>
              </div>
            </td>
          </tr>
          `;
  }
}

export class bulletRowProfileOnly {
  html: string;
  titles: string;
  bullets: string;
  bulletText: string;
  nameText: string;
  titleText: string;
  profileLink: string;

  constructor(
    nameText: string,
    titleText: string,
    bulletText: string,
    profileLink: string,
    storedTitles: string[],
    storedBullets: string[]
  ) {
    // Title formatting
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

    // Bullet formatting
    let bullets = storedBullets.slice();
    let bulletString = `<li>${bulletText}</li>\n`;
    for (let bullet of bullets) {
      bulletString += `<li>${bullet}</li>\n`;
    }

    this.nameText = nameText;
    this.titleText = titleText;
    this.bulletText = bulletText;
    this.bullets = bulletString;
    this.profileLink = profileLink;
    this.titles = titleString;
    this.html = `
        <tr>
          <td>
            <div class="picture-frame">
              <a href="${this.profileLink}" target="_blank">
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
              </a>
            </div>
          </td>
          <td>
            <div class="faculty-info">
              <p class="mdbluetext">
                <a href="${this.profileLink}" target="_blank">${
      this.nameText
    }</a>
              </p>
              <p class="highlighted-text">${this.titleText + this.titles}</p>
              <ul>
                ${this.bullets}
              </ul>
              <div class="faculty-icon--container">
                <a
                  href="${this.profileLink}"
                  target="_blank"
                  aria-label="View faculty profile"
                  role="button"
                  ><span class="faculty-icon--color"
                    ><span class="fontawesome-icon-inline"
                      ><span class="fa-sharp fa-regular fa-address-card fa-lg">
                      </span> </span></span
                ></a>
              </div>
            </div>
          </td>
        </tr>
        `;
  }
}

export class bulletRowEmailOnly {
  html: string;
  titles: string;
  bullets: string;
  bulletText: string;
  nameText: string;
  titleText: string;
  email: string;

  constructor(
    nameText: string,
    titleText: string,
    bulletText: string,
    email: string,
    storedTitles: string[],
    storedBullets: string[]
  ) {
    // Title formatting
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

    // Bullet formatting
    let bullets = storedBullets.slice();
    let bulletString = `<li>${bulletText}</li>\n`;
    for (let bullet of bullets) {
      bulletString += `<li>${bullet}</li>\n`;
    }

    this.nameText = nameText;
    this.titleText = titleText;
    this.bulletText = bulletText;
    this.bullets = bulletString;
    this.email = email;
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
              <p class="mdbluetext">${this.nameText}</p>
              <p class="highlighted-text">${this.titleText + this.titles}</p>
              <ul>
                ${this.bullets}
              </ul>
              <div class="faculty-icon--container">
                <a
                  href="${this.email}"
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
