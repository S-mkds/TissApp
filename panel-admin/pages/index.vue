
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
    loginDirection() {
      this.showSpinner = false;
      setTimeout(() => {
        this.showSpinner = true;
        this.$router.push({ path: '/login' });
      }, 1000);
    }
  },

}

</script>



<template>
  <section class="main-container">

    <div class="stars">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>

      <!-- etc... -->
    </div>

    <div class="title-container animate__animated animate__fadeInLeft">
      <CustomSpinner v-if="showSpinner"></CustomSpinner>
      <img class="logo-img" src="~/static/NewLogo.png" alt="Logo" />
      <h1 class="main-title" @click="loginDirection(); showSpinner = true">TISSAPP</h1>
      <p class="main-description">AdminPanel</p>
    </div>
  </section>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0F1828;
  background-image: linear-gradient(120deg, #155799, #159957);
  height: 100vh;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}

.logo-img {
  width: 100px;
  height: 100px;
  margin-right: 5px;
  opacity: 1;
  object-fit: contain;
  display: block;
  margin: 0;
  padding: 0;
}

.main-title {
  background-clip: text;
  -webkit-background-clip: text;
  background-image: linear-gradient(120deg, #155799, #159957);
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0;
  cursor: pointer;
  font-family: 'Sigmar One', cursive;
  text-shadow: 2px 2px 3px #7c7c7c;
}

.main-title:hover {
  opacity: 0.8;

}

.main-descrition {
  height: 5px;
  background-color: #fff;
  color: #fff;
  font-family: 'Sigmar One', cursive;
  text-shadow: 2px 2px 3px #7c7c7c;
}

/* STARS */
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.star {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: rgb(255, 174, 0);
  border-radius: 50%;
  animation: twinkle 1s ease-in-out infinite;
}

.star:nth-child(1) {
  top: 25%;
  left: 40%;
}

.star:nth-child(2) {
  top: 30%;
  left: 80%;
}

.star:nth-child(3) {
  top: 50%;
  left: 75%;
}

.star:nth-child(4) {
  top: 75%;
  left: 20%;
  background-color: rgba(179, 255, 0, 0.836);
}

.star:nth-child(5) {
  top: 90%;
  left: 70%;
  background-color: rgba(212, 0, 255, 0.137);
}

.star:nth-child(6) {
  top: 75%;
  left: 80%;
  background-color: rgb(255, 187, 0);
}

.star:nth-child(7) {
  top: 50%;
  left: 60%;
  background-color: rgba(255, 0, 0, 0.836);
}

.star:nth-child(8) {
  top: 20%;
  left: 80%;
  background-color: rgb(0, 225, 255);
}

.star:nth-child(9) {
  top: 10%;
  left: 50%;
  background-color: rgba(255, 0, 0, 0.836);
}

.star:nth-child(10) {
  top: 30%;
  left: 20%;
  background-color: rgba(255, 0, 0, 0.836);
}

.star:nth-child(11) {
  top: 50%;
  left: 10%;
  background-color: rgba(255, 0, 0, 0.836);
}

.star:nth-child(12) {
  top: 80%;
  left: 30%;
  background-color: rgba(255, 0, 0, 0.836);
}


@keyframes twinkle {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  20% {
    transform: scale(.5);
    opacity: .5;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>