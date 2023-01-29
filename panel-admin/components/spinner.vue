<template>
    <div class="spinner-container">
        <div class="spinner"></div>
    </div>
</template>

<style>
.spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
}

.spinner {
    width: 60px;
    /* plus grand */
    height: 60px;
    /* plus grand */
    border: 6px solid #f3f3f3;
    /* plus épais */
    border-top: 6px solid #3498db;
    /* plus épais */
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
    /* plus long */
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>

<script>
export default {
    mounted() {
        setTimeout(() => {
            this.stopSpinner()
        }, 1500) /* 1.5 secondes */
    },
    methods: {
        stopSpinner() {
            this.$el.remove()
        }
    }
}
</script>
