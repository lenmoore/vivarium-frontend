<script setup>
import { defineProps, onBeforeMount, ref } from 'vue';
import { usePerformanceStore } from '../../../store/performance.store';

const performanceStore = usePerformanceStore();
const props = defineProps(['coolAlgorithmedVisitors', 'color', 'games']);
const allAnswers = [];
Array.from(props.coolAlgorithmedVisitors[props.color]).forEach((visitor) =>
    visitor.quiz_results.forEach((p) => {
        allAnswers.push(p);
    })
);
onBeforeMount(async () => {
    console.log('dude why');
    await performanceStore.getActorCapsuleVisitors(props.color);
});
</script>
<template>
    <div>
        <div
            v-for="(game, i) in props.games.filter((g) =>
                g.open_for_colors.includes(props.color)
            )"
            :key="game._id + i"
            class="border my-2 p-4"
        >
            <div>
                <div
                    v-for="step in game.game_steps"
                    :key="step._id"
                    class="py-2"
                >
                    <h4>{{ step.question_text }}</h4>
                    <div
                        v-for="option in step.question_options"
                        :key="option.option_text"
                    >
                        {{ option.option_text }}
                        <strong
                            >({{
                                allAnswers.filter(
                                    (ans) =>
                                        ans.result_text ===
                                            option.option_text &&
                                        ans.step === step._id
                                ).length
                            }})</strong
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
