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

        <p>Suunan sind õigel hetkel õigesse kohta.</p>
        <p>
            Kui jään sinu aitamisega hätta või ei ole muul moel oma ülesannete
            kõrgusel, kontakteeru julgelt tugipersonaliga.
        </p>
        <p>Tänane teekond on ühes vaatuses.</p>
        <p>
            Sinu ülesanne on liikuda ruumist ruumi, vaadelda ja võtta minu abil
            vastu otsuseid. Ei midagi enamat.
        </p>
        <h3>Ilusat etendust!</h3>
        <p>Esmalt aga külasta kohvikut esimesel korrusel.</p>
        <p>Teisele korrusele saab minna alates 18.45.</p>
        <a class="btn btn-primary w-100" href="/visitor/humanity-shop/basket"
            >Poodi</a
        >
    </div>
</template>
