<script setup>
import { useVisitorStore } from '../../store/visitore.store';
import BaseForm from '../../components/BaseForm/index.vue';
import BaseInput from '../../components/BaseForm/BaseInput.vue';

const visitor = {
    username: '',
    password: '',
};

const visitorStore = useVisitorStore();

function onLogin() {
    return visitorStore
        .login(visitor.username, visitor.password)
        .then((data) => {
            console.log(data);
        })
        .finally(() => {
            this.reload();
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
