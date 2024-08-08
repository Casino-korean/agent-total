<script setup>
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  SUPPORT_LOCALES as supportLocales,
  setI18nLanguage,
} from "@/i18n/i18n.js";

const { locale } = useI18n({ useScope: "global" });
watch(locale, (val) => {
  setI18nLanguage(val);
});
</script>

<template>
  <!-- <div class="select">
    <select class="App-language" v-model="locale">
      <option
        v-for="optionLocale in supportLocales"
        :key="`locale-${optionLocale}`"
        :value="optionLocale"
      >
        {{ optionLocale }}
      </option>
    </select>
  </div> -->

  <a-select
    ref="select"
    v-model:value="locale"
    style="width: 100%"
    @focus="focus"
    @change="handleChange"
  >
    <a-select-option
      v-for="optionLocale in supportLocales"
      :key="`locale-${optionLocale}`"
      :value="optionLocale"
      >{{ optionLocale }}</a-select-option
    >
  </a-select>
</template>
<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  outline: 0;
  box-shadow: none;
  border: 0 !important;
  background: DeepSkyBlue;
  background-image: none;
}

.select {
  position: relative;
  display: flex;
  width: 100%;
  height: 3em;
  line-height: 3;
  background: #fff;
  overflow: hidden;
  border-radius: 0.25em;
}
select {
  flex: 1;
  padding: 0 0.5em;
  color: #fff;
  cursor: pointer;
}
/* thiết kế dấu mũi tên */
.select::after {
  content: "\25BC";
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 1em;
  background: DodgerBlue;
  cursor: pointer;
  pointer-events: none;
  -webkit-transition: 0.25s all ease;
  -o-transition: 0.25s all ease;
  transition: 0.25s all ease;
  color: white;
}
/* Transition */
.select:hover::after {
  color: Gainsboro;
}
</style>
