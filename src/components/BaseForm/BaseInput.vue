<template>
    <div v-if="editMode">
        <div>
            <label :for="id" class="text-turquoise"> {{ label }} </label>
        </div>

        <input
            :name="name"
            :placeholder="placeholder || label"
            :id="id"
            :type="type"
            :value="modelValue"
            @input="updateValue"
        />
    </div>
    <div v-else>{{ modelValue }}</div>
</template>

<script>
export default {
    name: 'BaseInput',
    components: {},
    props: {
        isNumberType: {
            type: Boolean,
            default: false,
        },
        uppercase: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        editMode: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        modelValue: {
            type: [String, Number],
            default: '',
        },
    },
    setup(props, context) {
        const updateValue = (event) => {
            context.emit('update:modelValue', event.target.value);
        };

        return { updateValue };
    },
    computed: {
        val: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
    },
    methods: {
        onInput(e) {
            const value = e.target;
            if (this.disabled) {
                return;
            }
            this.val = value;
        },
    },
};
</script>

<style lang="scss">
input {
    margin-bottom: 1rem;
    display: inline-flex;
    width: 100%;
    &::placeholder {
        font-size: 0.75rem;
    }
}
</style>
