<template>
    <div class="form-wrapper">
        <form onsubmit="return false;">
            <div v-if="isLoading" class="d-flex justify-content-center">
                <img alt="loader" src="/public/Spinner-1s-200px.gif" />
            </div>
            <div v-else>
                <slot></slot>
                <div class="buttons">
                    <button
                        v-if="showCancel"
                        class="btn btn-outline-primary"
                        @on-click="cancel"
                    >
                        Cancel
                    </button>
                    <button class="btn btn-primary" @on-click.prevent="submit">
                        {{ submitLabel }}
                    </button>
                </div>
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
            default: false,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        submitLabel: {
            type: String,
            default: 'OK',
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
        width: 100%;
    }
}

.buttons {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    .btn {
        width: 100%;
    }
}
</style>
