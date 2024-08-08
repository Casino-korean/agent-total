<template>
  <a-modal :title="$t('Partner.agentPay')" :onCancel="closeModal" :open="true">
    <a-form
      ref="createAccountForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
    >
      <a-form-item :label="$t('Partner.DlDepoWi')" name="AgentWd">
        <a-switch
          @change="onAddGlobalTransferMoney"
          :checked="isAgentGlobalTransferMoney"
        />
      </a-form-item>
      <a-form-item>
        <a-alert :message="$t('Partner.noitiDlDW')" type="warning" />
      </a-form-item>
    </a-form>
    <template #footer> </template>
  </a-modal>
</template>
<script setup>
import { defineProps, defineEmits, ref } from "vue";

import request, { handleRequest } from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps(["curtableData"]);
const emit = defineEmits(["close"]);
function closeModal() {
  emit("close");
}
const isAgentGlobalTransferMoney = ref(
  Boolean(props.curtableData.isAgentGlobalTransferMoney)
);

async function onAddGlobalTransferMoney() {
  isAgentGlobalTransferMoney.value = !isAgentGlobalTransferMoney.value;
  handleRequest(
    request.put(api.AGENT_GLOBALTRANSFERMONEY + `/${props.curtableData._id}`, {
      isAgentGlobalTransferMoney: Number(isAgentGlobalTransferMoney.value),
    }),
    () => {
      emit("Edit");
    },
    $t("Partner.changeAgentPaySuc")
  );
}
</script>
