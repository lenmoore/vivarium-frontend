<template>
    <div v-if="editMode">
        <div v-if="type !== 'checkbox'">
            <label :for="id"> {{ label }} </label>
        </div>

        <select
            v-if="type === 'select'"
            :id="id"
            :name="name"
            :value="modelValue"
            @input="updateValue"
        >
            <option
                v-for="(option, i) in options"
                :id="i + ' ' + option"
                :key="i + ' ' + option"
                :name="name"
                :value="option._id"
            >
                {{ option.name }}
            </option>
        </select>
        <div
            v-else-if="type === 'checkbox'"
            class="font-size-xs d-flex align-items-center justify-content-start"
            @click="updateValue"
        >
            <span class="d-flex align-items-center">
                <input
                    :id="id"
                    :name="name"
                    :placeholder="placeholder || label"
                    :type="type"
                    :value="modelValue"
                    @input="updateValue"
                />
            </span>
            <span class="px-2 pb-3">{{ label }}</span>
        </div>
        <input
            v-else
            :id="id"
            :class="inputClass"
            :name="name"
            :placeholder="placeholder || label"
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
        inputClass: {
            type: String,
            default: '',
        },
        modelValue: {
            type: [String, Number],
            default: '',
        },
        options: {
            type: Array,
            default: () => [],
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
    background-color: transparent;
    padding-top: 1rem;
    padding-bottom: 0.5rem;
    border: 0;
    border-bottom: 1px solid black;
    border-radius: 0;

    &::placeholder {
        font-size: 1rem;
    }
}
</style>
