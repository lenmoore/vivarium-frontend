<script setup>
import router from '../../router/index';

function goScan() {
    router.push({ name: 'visitor.humanity-shop.scan' });
}
</script>

<template>
    <div class="container">
        <div class="d-flex align-items-center justify-content-center">
            <img
                alt=""
                src="../../../public/img-removebg-preview.png"
                width="200"
            />
        </div>
        <h2>Tere!</h2>
        <p>Mina olen sinu abiline Vivaariumis.</p>
        <p>
            Suunan sind õigel hetkel õigesse kohta. <br />
            Kui jään sinu aitamisega hätta või ei ole muul moel oma ülesannete
            kõrgusel, kontakteeru julgelt tugipersonaliga.
        </p>

        <p>Tänase teekonna pikkus on umbes 2 tundi.</p>
        <p>
            Sinu ülesanne on liikuda ruumist ruumi, vaadelda ja võtta minu abil
            vastu otsuseid. Ei midagi enamat.
        </p>

        <h3>Ilusat etendust!</h3>
        <p>
            Esmalt aga külasta kohvikut esimesel korrusel. Teisele korrusele
            saab minna alates 18.45.
        </p>
        <small class="bg-dark text-white"
            >Tee poe faasi alguses refresh, see syncimine laks eile
            katki.</small
        >
    </div>
</template>
