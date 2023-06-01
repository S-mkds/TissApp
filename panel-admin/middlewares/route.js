export default function ({ app }) {
  if (process.client) {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) {
      const darkMode = JSON.parse(storedDarkMode);
      app.$darkModeConfig.darkMode = darkMode;
    }
    app.$darkModeConfig.initializeDarkMode();
  }
}
