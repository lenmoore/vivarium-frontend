<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['coolAlgorithmedVisitors', 'color']);
let sortedVisitors = [];
if (props?.color?.length > 0) {
    sortedVisitors = ref(
        Array.from(props.coolAlgorithmedVisitors[props.color])
    );
} else {
    sortedVisitors = [
        ...Array.from(props.coolAlgorithmedVisitors.turq),
        ...Array.from(props.coolAlgorithmedVisitors.fuchsia),
        ...Array.from(props.coolAlgorithmedVisitors.lime),
        ...Array.from(props.coolAlgorithmedVisitors.silver),
    ];
    console.log(sortedVisitors);
}
sortedVisitors?.value?.sort((a, b) => a.wardrobe_number - b.wardrobe_number);
</script>
<template>
    <div>
        {{ sortedVisitors.length }} inimest sinu kapslis.

        <div v-if="props.color != null">
            <div>
                lime ({{ props.coolAlgorithmedVisitors.lime.size }}):
                <span
                    v-for="visitor in props.coolAlgorithmedVisitors.lime"
                    :key="visitor._id + 'short'"
                    >{{ visitor.wardrobe_number }},
                </span>
            </div>
            <div>
                fuchsia ({{ props.coolAlgorithmedVisitors.fuchsia.size }}):
                <span
                    v-for="visitor in props.coolAlgorithmedVisitors.fuchsia"
                    :key="visitor._id + 'short'"
                    >{{ visitor.wardrobe_number }},
                </span>
            </div>
            <div>
                silver ({{ props.coolAlgorithmedVisitors.silver.size }}):
                <span
                    v-for="visitor in props.coolAlgorithmedVisitors.silver"
                    :key="visitor._id + 'short'"
                    >{{ visitor.wardrobe_number }},
                </span>
            </div>
            <div>
                turq ({{ props.coolAlgorithmedVisitors.turq.size }}):
                <span
                    v-for="visitor in props.coolAlgorithmedVisitors.turq"
                    :key="visitor._id + 'short'"
                    >{{ visitor.wardrobe_number }},
                </span>
            </div>
        </div>
        <!--start stackexchange example-->
        <div>
            <!--            <div-->
            <!--                v-for="visitor in coolAlgorithmedVisitors.turq"-->
            <!--                :key="visitor._id"-->
            <!--                :class="props.color + ' ' + visitor"-->
            <!--                class="visitor-wrapper mt-2 text-center d-flex justify-content-between"-->
            <!--            >-->
            <!--                { "id": {{ visitor.wardrobe_number }},-->
            <!--                "current_algorithm_result": "turq", "values": {"lime":-->
            <!--                {{ visitor.avg_hum_values.lime }}, "fuchsia":-->
            <!--                {{ visitor.avg_hum_values.fuchsia }}, "silver":-->
            <!--                {{ visitor.avg_hum_values.silver }}, "turq":-->
            <!--                {{ visitor.avg_hum_values.turq }}} },-->
            <!--            </div>-->
            <h4>Silver:</h4>
            <div
                v-for="visitor in coolAlgorithmedVisitors.silver"
                :key="visitor._id"
                :class="props.color + ' ' + visitor"
                class="visitor-wrapper mt-2 text-center d-flex justify-content-between"
            >
                <div class="d-flex">
                    <h2 style="width: 4em">{{ visitor.wardrobe_number }}</h2>
                    {{ visitor.algorithm_result }}
                </div>
                <div class="border-top w-50">
                    <div>
                        <small class="font-size-xs bg-fuchsia p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.fuchsia)
                        }}</small>
                        <small class="font-size-xs bg-green p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.lime)
                        }}</small>
                        <small class="font-size-xs bg-orange p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.turq)
                        }}</small>
                        <small class="font-size-xs bg-blue p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.silver)
                        }}</small>
                    </div>
                </div>
            </div>
            <br />
            <div
                v-for="visitor in coolAlgorithmedVisitors.fuchsia"
                :key="visitor._id"
                :class="props.color + ' ' + visitor"
                class="visitor-wrapper mt-2 text-center d-flex justify-content-between"
            >
                <div class="d-flex">
                    <h2 style="width: 4em">{{ visitor.wardrobe_number }}</h2>
                    {{ visitor.algorithm_result }}
                </div>
                <div class="border-top w-50">
                    <div>
                        <small class="font-size-xs bg-fuchsia p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.fuchsia)
                        }}</small>
                        <small class="font-size-xs bg-green p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.lime)
                        }}</small>
                        <small class="font-size-xs bg-orange p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.turq)
                        }}</small>
                        <small class="font-size-xs bg-blue p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.silver)
                        }}</small>
                    </div>
                </div>
            </div>
            <h4>Turq:</h4>
            <div
                v-for="visitor in coolAlgorithmedVisitors.turq"
                :key="visitor._id"
                :class="props.color + ' ' + visitor"
                class="visitor-wrapper mt-2 text-center d-flex justify-content-between"
            >
                <div class="d-flex">
                    <h2 style="width: 4em">{{ visitor.wardrobe_number }}</h2>
                    {{ visitor.algorithm_result }}
                </div>
                <div class="border-top w-50">
                    <div>
                        <small class="font-size-xs bg-fuchsia p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.fuchsia)
                        }}</small>
                        <small class="font-size-xs bg-green p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.lime)
                        }}</small>
                        <small class="font-size-xs bg-orange p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.turq)
                        }}</small>
                        <small class="font-size-xs bg-blue p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.silver)
                        }}</small>
                    </div>
                </div>
            </div>
            <br />
            <h4>Lime:</h4>
            <div
                v-for="visitor in coolAlgorithmedVisitors.lime"
                :key="visitor._id"
                :class="props.color + ' ' + visitor"
                class="visitor-wrapper mt-2 text-center d-flex justify-content-between"
            >
                <div class="d-flex">
                    <h2 style="width: 4em">{{ visitor.wardrobe_number }}</h2>
                    {{ visitor.algorithm_result }}
                </div>
                <div class="border-top w-50">
                    <div>
                        <small class="font-size-xs bg-fuchsia p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.fuchsia)
                        }}</small>
                        <small class="font-size-xs bg-green p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.lime)
                        }}</small>
                        <small class="font-size-xs bg-orange p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.turq)
                        }}</small>
                        <small class="font-size-xs bg-blue p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.silver)
                        }}</small>
                    </div>
                </div>
            </div>
        </div>
        <!--end stackexchange example-->
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div>
            <div
                v-for="visitor in sortedVisitors"
                :key="visitor._id"
                :class="props.color + ' ' + visitor"
                class="visitor-wrapper mt-2 text-center d-flex justify-content-between"
            >
                <div class="d-flex">
                    <h2 style="width: 4em">{{ visitor.wardrobe_number }}</h2>

                    <div
                        class="border-top d-flex flex-column align-items-start"
                    >
                        Tooteid korvis:
                        {{ visitor.basket.products.length }},
                        <small
                            v-for="product in visitor.basket.products"
                            :key="product.title"
                            >{{ product.title }},<br />
                        </small>
                    </div>
                </div>
                <div class="border-top w-50">
                    <div>
                        Vastused: <br />
                        <small
                            v-for="result in visitor.quiz_results"
                            :key="result.result_text"
                            >{{ result.result_text }},
                        </small>
                    </div>
                    <div>
                        <small class="font-size-xs bg-fuchsia p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.fuchsia)
                        }}</small>
                        <small class="font-size-xs bg-green p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.lime)
                        }}</small>
                        <small class="font-size-xs bg-orange p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.turq)
                        }}</small>
                        <small class="font-size-xs bg-blue p-1 m-1">{{
                            Math.floor(visitor.avg_hum_values.silver)
                        }}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.turq {
    border: 2px solid #02e5dd;
}
</style>
