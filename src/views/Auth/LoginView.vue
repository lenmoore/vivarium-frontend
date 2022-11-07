<script setup>
import { useAuthStore } from '../../store/auth.store';
import BaseForm from '../../components/BaseForm/index.vue';
import BaseInput from '../../components/BaseForm/BaseInput.vue';
import router from '../../router/index';

const user = {
    username: '',
    password: '',
};

const authStore = useAuthStore();

function onLogin() {
    return authStore
        .login(user.username, user.password)
        .then((data) => {
            console.log(data);
        })
        .finally(() => {
            console.log('jou');
            router.push({ name: 'admin.performances' });
        });
}
</script>

<template>
    <BaseForm :show-cancel="false" @submit="onLogin">
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
