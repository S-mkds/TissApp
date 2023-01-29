<template>
    <div class="modal-overlay" v-if="showModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirmation</h3>
            </div>
            <div class="modal-body">
                Êtes-vous sûr de vouloir continuer ?
            </div>
            <div class="modal-footer">
                <button @click="confirm" class="btn btn-primary">OK</button>
                <button @click="cancel" class="btn btn-secondary">Annuler</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["showModal"],
    methods: {
        confirm() {
            this.$emit("confirm");
        },
        cancel() {
            this.$emit("cancel");
        }
    }
}
</script>

<style>
.modal-overlay {
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
}
</style>
