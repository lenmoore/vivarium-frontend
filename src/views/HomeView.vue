<template>
    <div class="home">
        hey {{ useMainStore.name }}<br />
        <button @click="submitClick">{{ useMainStore.counter }}</button>
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '../components/HelloWorld.vue';
import { useMainStore } from '../store';

@Options({
    components: {
        HelloWorld,
    },
})
export default class LoginView extends Vue {
    useMainStore = useMainStore();

    async submitClick() {
        const { addOne } = useMainStore();
        console.log('submit clicked');
        addOne();
    }
}
</script>
