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
            router.push({ name: 'admin.performances' });
            this.$forceUpdate();
        });
}
</script>

<template>
    <BaseForm :show-cancel="false" @submit="onLogin">
        <BaseInput
            :id="'email'"
            v-model="user.username"
            :label="'Your email'"
            :type="'text'"
            name="username"
        />
        <BaseInput
            :id="'password'"
            v-model="user.password"
            :label="'Your password'"
            :type="'text'"
            name="password"
        />
    </BaseForm>
</template>
