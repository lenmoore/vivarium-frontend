<script setup>
import { QrStream } from 'vue3-qr-reader';
const result = '';
const customError = '';
</script>
<template>
    <div>
        <h2>Scan a product~~~</h2>
        <div class="scanner-wrapper">
            {{ result }} trynna scan {{ customError }} <QrStream></QrStream>
        </div>
    </div>
</template>
