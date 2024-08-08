<template>
  <div
    v-for="n in 2"
    :key="'dice-' + n"
    class="w-10 h-10 border-2 border-solid rounded-md inline-flex justify-center items-center font-bold mx-1 my-1 cursor-pointer text-black opacity-45"
    :class="{
      active: props.active === n - 1,
      'border-red-400': n % 2 === 0,
      'border-black': n % 2 === 1,
    }"
    @click="setDice(n - 1)"
  >
    <div class="h-5 w-5 bg-black rounded-full border-4 flex justify-center items-center" v-if="n % 2 == 1">
      <div class="h-4 w-4 bg-white rounded-full"></div>
    </div>
    <div v-else class="h-5 w-5 bg-red-500 rounded-full"></div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps(["dice", "active"]);
const emit = defineEmits(["setDice"]);

function setDice(value) {
  emit("setDice", { dice: props.dice, value });
}
</script>
<style scoped>
.active {
  opacity: 1;
  transform: scale(1.2);
}
</style>