<template>
    <div></div>
</template>
  
<script>
export default {
    created() {
        const storedLightMode = localStorage.getItem("lightMode");
        if (storedLightMode) {
            const lightMode = JSON.parse(storedLightMode);
            this.$lightModeConfig.lightMode = lightMode;
        }
        this.$lightModeConfig.initializeLightMode();
        this.$lightModeConfig.toggleLightMode(); // Appeler la fonction toggleLightMode à chaque montée de la page
    },
};
</script>

<style></style>