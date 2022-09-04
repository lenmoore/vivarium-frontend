<template>
    <div class="home">
        hey {{ useStore.name }}<br />
        <button @click="submitClick">{{ useStore.counter }}</button>
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue';
import { useStore } from '@/store'; // @ is an alias to /src

@Options({
    components: {
        HelloWorld,
    },
})
export default class LoginView extends Vue {
    useStore = useStore();

    async submitClick() {
        const { addOne } = useStore();
        console.log('submit clicked');
        addOne();
    }
}
</script>
