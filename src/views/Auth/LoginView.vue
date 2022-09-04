<template>
    <div>login view :)</div>
    <BaseForm @submit="login">
        <BaseInput
            :id="'email'"
            :label="'Your email'"
            :type="'text'"
            name="username"
            v-model="username"
        />
        <BaseInput
            :id="'password'"
            :label="'Your password'"
            :type="'text'"
            name="password"
            v-model="password"
        />
    </BaseForm>
</template>

<script>
import { useAuthStore } from '@/store/auth.store';
import BaseForm from '@/components/BaseForm';
import BaseInput from '@/components/BaseForm/BaseInput';

export default {
    components: { BaseInput, BaseForm },
    data() {
        return {
            username: '',
            password: '',
        };
    },

    methods: {
        login() {
            const { login } = useAuthStore();

            login(this.username, this.password);
        },
    },
};
</script>
