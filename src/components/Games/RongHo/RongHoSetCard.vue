<template>
  <div
    v-for="n in 14"
    :key="'dice-' + n"
    class="w-10 h-10 border-2 border-solid border-red-400 rounded-md inline-flex justify-center items-center font-bold mx-1 my-1 cursor-pointer text-black opacity-45"
    :class="{
        active: props.active === n - 1
    }"
    @click="setDice(n - 1)"
  >
    {{ cards[n - 1] }}
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps(["dice","active"]);
const emit = defineEmits(["setDice"]);

const cards = ["0", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

function setDice(value) {
  emit("setDice", { card: props.dice, value });
}
</script>
<style scoped>
.active {
    opacity: 1;
    transform: scale(1.2);
}
</style>