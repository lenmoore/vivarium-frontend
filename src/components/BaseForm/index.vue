<template>
    <div class="form-wrapper">
        <form onsubmit="return false;">
            <slot></slot>

            <div class="buttons">
                <button
                    v-if="showCancel"
                    class="btn btn-outline-primary"
                    @on-click="cancel"
                >
                    Cancel
                </button>
                <button class="btn btn-primary" @on-click="submit">OK</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'BaseForm',
    props: {
        showCancel: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        submit() {
            console.log('submit');
            this.$emit('submit');
        },
        cancel() {
            console.log('cancel');
            this.$emit('cancel');
        },
    },
};
</script>

<style lang="scss">
.form-wrapper {
    form {
        width: 20rem;
    }
}

.buttons {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
}
</style>
