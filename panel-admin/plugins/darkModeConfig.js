import Vue from "vue";

export const darkModeConfig = Vue.observable({
  darkMode: false,
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (process.client) {
      localStorage.setItem("darkMode", JSON.stringify(this.darkMode));
      updateDarkModeClasses(); // Appel à updateDarkModeClasses() après avoir modifié le mode sombre
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
    "html, body, h1, h2, h3, h4, h5, h6, p, div, label, .w-text"
  );

  elements.forEach((element) => {
    if (darkModeConfig.darkMode) {
      element.classList.add("dark-mode");
    } else {
      element.classList.remove("dark-mode");
    }
  });
}

export default ({ app }, inject) => {
  if (process.client) {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) {
      const darkMode = JSON.parse(storedDarkMode);
      darkModeConfig.darkMode = darkMode;
    }
    darkModeConfig.initializeDarkMode();
  }

  inject("darkModeConfig", darkModeConfig);
};
