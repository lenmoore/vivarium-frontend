<script setup>
import { QrStream } from 'vue3-qr-reader';
const result = '';
const customError = '';
</script>
<template>
    <div class="container">
        <h1>scanner test 1</h1>

        <div class="scanner-wrapper">
            {{ result }} trynna scan {{ customError }} <QrStream></QrStream>
        </div>
    </div>
</template>
