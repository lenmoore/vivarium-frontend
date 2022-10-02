<script setup>
import useAuthStore from '../../store/auth.store';
import BaseForm from '../../components/BaseForm/index.vue';
import BaseInput from '../../components/BaseForm/BaseInput.vue';

const user = {
    username: '',
    password: '',
};

async function onLogin() {
    const authStore = useAuthStore();

    await authStore.login(user.username, user.password);
}
</script>

<template>
    <div>login view :)</div>
    <BaseForm @submit="onLogin">
        <BaseInput
            :id="'email'"
            :label="'Your email'"
            :type="'text'"
            name="username"
            v-model="user.username"
        />
        <BaseInput
            :id="'password'"
            :label="'Your password'"
            :type="'text'"
            name="password"
            v-model="user.password"
        />
    </BaseForm>
</template>
