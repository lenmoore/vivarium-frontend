<template>
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
</template>
