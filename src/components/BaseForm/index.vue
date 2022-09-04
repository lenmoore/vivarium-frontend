<template>
    <form>
        <slot></slot>

        <button @click="submit">submit</button>
        <button @click="cancel">cancel</button>
    </form>
</template>

<script>
export default {
    name: 'BaseForm',
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
