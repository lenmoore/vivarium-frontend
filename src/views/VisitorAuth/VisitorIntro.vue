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
                width="300"
            />
        </div>
        <h2>Tere tulemast Vivaariumisse.</h2>

        <p class="pt-4">
            Inimkonnal on käes rasked ajad, sest Maakera atmosfäär on alla
            andmas.
        </p>

        <p>
            Probleemi parandamiseks pole muud varianti, kui minna vähemalt 20
            aastaks elama kapslitesse. Vaid nõnda saab Maa piisavalt inimestest
            puhata ja taastuda - ja samal ajal puhastavad robotid meie ookeane
            ja filtrid meie õhku.
        </p>

        <p>
            Kapslitesse elama minekuks on igaühel võimalik kaasa võtta kuni 10
            eset, mis neile tegevust, lohutust ja turvatunnet pakkuda võiks. See
            ongi Sinu järgmine ülesanne, 001.
        </p>

        <p>
            Asjad poest otsa ei saa. Selleks, et midagi osta, skanneeri seinalt
            vastav QR-kood ning saad selle oma korvi lisada.
        </p>

        <p>
            Kui oled valmis ning enam ühtegi asja kaasa võtta ei taha, mine
            edasi ooteruumi.
        </p>
        <button class="btn btn-primary" @click="goScan">Sain aru</button>
    </div>
</template>
