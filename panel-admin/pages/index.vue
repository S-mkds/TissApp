<script>
import CustomSpinner from '../components/spinner.vue'
import 'animate.css/animate.min.css';

export default {
  components: { CustomSpinner },
  data() {
    return {
      showSpinner: false, //Spinner
    }
  },
  methods: {
    toggleLightMode() {
      this.$lightModeConfig.toggleLightMode();
    },
    loginDirection() {
      this.showSpinner = false;
      setTimeout(() => {
        this.showSpinner = true;
        this.$router.push({ path: '/login' });
      }, 1000);
    },
  },
  mounted() {
    this.$lightModeConfig.initializeLightMode();
  },
}
</script>

<template>
  <div class="index-container">
    <div class="title-index animate__animated animate__fadeInLeft">
      <CustomSpinner v-if="showSpinner"></CustomSpinner>
      <img class="logo-index" src="~/static/NewLogo.png" alt="Logo" />
      <h1 class="mainte-title-index" @click="loginDirection(); showSpinner = true">TISSAPP</h1>
    </div>
    <p class="w-text">Administration</p>
    <!-- light mode -->
    <button class="color-mode-index" @click="toggleLightMode">Activer/Désactiver le mode sombre</button>
  </div>
</template>

<style>
.index-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Utilise 100% de la largeur de la fenêtre */
  height: 100% !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  width: 100%;
  height: 100%;
}

.title-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.logo-index {
  width: 100px;
  height: 100px;
  margin-right: 5px;
  opacity: 1;
  object-fit: contain;
  display: block;
  margin: 0;
  padding: 0;
}

.mainte-title-index {
  background-clip: text;
  -webkit-background-clip: text;
  background-image: linear-gradient(120deg, #155799, #159957);
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0;
  cursor: pointer;
  font-family: 'trebuchet ms', sans-serif;
  color: white
}

.mainte-title-index:hover {
  opacity: 0.8;
}

.main-description-index {
  font-size: 1rem;
  justify-content: center;
  font-family: 'trebuchet ms', sans-serif;
  color: white
}

.color-mode-index {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #19426c;
  color: white;
  cursor: pointer;
  font-family: 'trebuchet ms', sans-serif;
}

.color-mode-index:hover {
  opacity: 0.8;
}
</style>