import Vue from "vue";

export const darkModeConfig = Vue.observable({
  darkMode: false,
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (process.client) {
      if (this.darkMode) {
        localStorage.setItem("darkMode", JSON.stringify(this.darkMode));
      } else {
        localStorage.removeItem("darkMode");
      }
      updateDarkModeClasses();
    }
  },

  initializeDarkMode() {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) {
      this.darkMode = JSON.parse(storedDarkMode);
    }
    updateDarkModeClasses();
  },
});

function updateDarkModeClasses() {
  const elements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, div, label"
  );
  const classes = document.querySelectorAll(".w-text");

  elements.forEach((element) => {
    if (darkModeConfig.darkMode) {
      element.classList.add("dark-mode");
    } else {
      element.classList.remove("dark-mode");
    }
  });

  classes.forEach((classElement) => {
    if (darkModeConfig.darkMode) {
      classElement.classList.add("dark-mode");
    } else {
      classElement.classList.remove("dark-mode");
    }
  });

  const html = document.documentElement;
  const body = document.body;

  if (darkModeConfig.darkMode) {
    html.classList.add("dark-mode");
    body.classList.add("dark-mode");
  } else {
    html.classList.remove("dark-mode");
    body.classList.remove("dark-mode");
  }
}

if (process.client) {
  const storedDarkMode = localStorage.getItem("darkMode");
  if (storedDarkMode) {
    const darkMode = JSON.parse(storedDarkMode);
    darkModeConfig.darkMode = darkMode;
  }
  darkModeConfig.initializeDarkMode();
}

export default darkModeConfig;

Vue.mixin({
  beforeCreate() {
    this.$options.darkModeConfig = darkModeConfig;
    this.$darkModeConfig = darkModeConfig;
  },
});
