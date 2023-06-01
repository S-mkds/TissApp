import Vue from "vue";

export const lightModeConfig = Vue.observable({
  lightMode: false,
  toggleLightMode() {
    this.lightMode = !this.lightMode;
    if (process.client) {
      if (this.lightMode) {
        localStorage.setItem("lightMode", JSON.stringify(this.lightMode));
      } else {
        localStorage.removeItem("lightMode");
      }
      console.log("Mode lumineux mis à jour :", this.lightMode); // Ajouter console.log pour le débogage
      updateLightModeClasses();
    }
  },

  initializeLightMode() {
    const storedLightMode = localStorage.getItem("LightMode");
    if (storedLightMode) {
      this.lightMode = JSON.parse(storedLightMode);
    }
    updateLightModeClasses();
  },
});

if (process.client) {
  const storedLightMode = localStorage.getItem("lightMode");
  if (storedLightMode) {
    const lightMode = JSON.parse(storedLightMode);
    lightModeConfig.lightMode = lightMode;
  }
  lightModeConfig.initializeLightMode();
}

function updateLightModeClasses() {
  const elements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, div, label"
  );
  const classes = document.querySelectorAll(".w-text");

  elements.forEach((element) => {
    if (lightModeConfig.lightMode) {
      element.classList.add("light-mode");
    } else {
      element.classList.remove("light-mode");
    }
  });

  classes.forEach((classElement) => {
    if (lightModeConfig.lightMode) {
      classElement.classList.add("light-mode");
    } else {
      classElement.classList.remove("light-mode");
    }
  });

  const html = document.documentElement;
  const body = document.body;

  if (lightModeConfig.lightMode) {
    html.classList.add("light-mode");
    body.classList.add("light-mode");
  } else {
    html.classList.remove("light-mode");
    body.classList.remove("light-mode");
  }
}

if (process.client) {
  const storedLightMode = localStorage.getItem("lightMode");
  if (storedLightMode) {
    const lightMode = JSON.parse(storedLightMode);
    lightModeConfig.lightMode = lightMode;
  }
  lightModeConfig.initializeLightMode();
}

export default lightModeConfig;

Vue.mixin({
  beforeCreate() {
    this.$options.lightModeConfig = lightModeConfig;
    this.$lightModeConfig = lightModeConfig;
  },
});
