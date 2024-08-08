<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import request, { handleRequest } from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const emit = defineEmits(["close"]);
const props = defineProps(["curtableData"]);

const showModal = ref(true);

const dataSubmit = reactive({
  bankName: props.curtableData.bankName,
  accountNumber: props.curtableData.accountNumber,
  accountName: props.curtableData.accountName,
  isEnabled: props.curtableData.isEnabled,
});
const createAccountForm = ref(null);

function closeModal() {
  emit("close");
}
async function onChangeEditIfBank() {
  const dataSend = {
    bankName: dataSubmit.bankName,
    accountNumber: dataSubmit.accountNumber,
    accountName: dataSubmit.accountName,
    isEnabled: dataSubmit.isEnabled,
  };
  handleRequest(
    request.post(
      api.ADMIN_EDITINFOBANK + `/${props.curtableData._id}`,
      dataSend
    ),
    () => {
      emit("Edit");
    },
    $t("Bank.noitiUpdateBankSuc")
  );
}
</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('Bank.eidtInfoBank')"
    :onCancel="closeModal"
  >
    <a-form
      ref="createAccountForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
    >
      <a-form-item :label="$t('Bank.nameBank')" name="name">
        <a-input v-model:value="dataSubmit.bankName" />
      </a-form-item>

      <a-form-item :label="$t('acountNumber')" name="phone">
        <a-input v-model:value="dataSubmit.accountNumber" />
      </a-form-item>

      <a-form-item :label="$t('User.acoutName')" name="location">
        <a-input v-model:value="dataSubmit.accountName" />
      </a-form-item>

      <a-form-item :label="$t('Bank.activated')" name="activated">
        <a-select
          v-model:value="dataSubmit.isEnabled"
          :placeholder="$t('Bank.activated')"
        >
          <a-select-option :value="1">
            {{ $t("Bank.activated") }}</a-select-option
          >
          <a-select-option :value="0">
            {{ $t("Bank.deactivate") }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">
          {{ $t("destroy") }}</a-button
        >
        <a-button @click="onChangeEditIfBank" type="primary" html-type="submit">
          {{ $t("create") }}</a-button
        >
      </a-form-item>
    </a-form>
    <template #footer> </template>
  </a-modal>
</template>
<style lang="scss"></style>
