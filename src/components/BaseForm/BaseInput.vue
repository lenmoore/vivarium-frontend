<template>
    <div v-if="type === 'text'">
        <label :for="id">
            {{ label }}
            <input
                :name="name"
                :id="id"
                type="text"
                :value="modelValue"
                @input="updateValue"
            />
        </label>
    </div>
    <div v-else-if="type === 'number'">number</div>
    <div v-else-if="type === 'date'">date</div>
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
