<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="n in 7"
      :key="'dice-' + n"
      class="w-10 h-10 border-2 border-solid border-red-400 rounded-md flex justify-center items-center font-bold cursor-pointer text-black opacity-45"
      :class="{
        active: props.active === dices[n - 1],
      }"
      @click="setDice(dices[n - 1])"
    >
      {{ dicesText[n - 1] }}
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps(["dice", "active"]);
const emit = defineEmits(["setDice"]);

const dices = ["", "bau", "cua", "ca", "ga", "tom", "nai"];
const dicesText = ["", "Bầu", "Cua", "Cá", "Gà", "Tôm", "Nai"];

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