<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import { MoreOutlined, CheckCircleOutlined } from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import { notification } from "ant-design-vue";

import request, { handleRequest } from "@/request";
import api from "@/request/api";
import { data } from "autoprefixer";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const emit = defineEmits(["close"]);
const props = defineProps(["curtableData", "agents"]);

const showModal = ref(true);

const dataSubmit = reactive({
  username: props.curtableData.username,
  password: '',
  refCode: props.curtableData.refCode,
  cskh: props.curtableData?.cskh ?? '',
  isDisabled: props.curtableData.isDisabled ?? 0,
  uplineID: props.curtableData.uplineID

});
const createAccountForm = ref(null);
const agentOptions = Array.from(props.agents).map((e) => {
  return {
    value: e.refCode,
    label: e.username
  }
})

function closeModal() {
  emit("close");
}
async function onChangeAgent() {
  const dataSend = {
    username: dataSubmit.username,
    password: dataSubmit.password,
    cskh: dataSubmit.cskh,
    isDisabled: dataSubmit.isDisabled
  };
  handleRequest(
    request.patch(api.AGENT_CHANGE + `/${props.curtableData._id}`, dataSend),
    () => {
      emit("Edit");
    },
    $t("Partner.noitiUpdateAgentSuc")
  );
}
</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('Partner.editAgent')"
    :onCancel="closeModal"
    :width="600"
  >
    <a-form
      ref="createAccountForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
    >
      <a-form-item :label="$t('User.userName')" name="name">
        <a-input
          :rules="[{ required: true, message: $t('User.userName') }]"
          v-model:value="dataSubmit.username"
        />
      </a-form-item>

      <a-form-item :label="$t('User.pass')" name="pass">
        <a-input
          v-model:value="dataSubmit.password"
        />
      </a-form-item>

<!--      <a-form-item-->
<!--        :label="$t('User.generalAgent')"-->
<!--        name="agent"-->
<!--      >-->
<!--        <a-select-->
<!--          :disabled="true"-->
<!--          :placeholder="$t('User.vipPlace')"-->
<!--          :options ="agentOptions"-->
<!--          v-model:value="dataSubmit.uplineID"-->
<!--        >-->
<!--        </a-select>-->
<!--      </a-form-item>-->

<!--       <a-form-item :label="$t('Partner.CSKH')" name="ReferralCode">-->
<!--        <a-input-->
<!--          v-model:value="dataSubmit.cskh"-->
<!--        />-->
<!--      </a-form-item>-->



      <a-form-item class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("destroy")
        }}</a-button>
        <a-button @click="onChangeAgent" type="primary" html-type="submit">{{
          $t("create")
        }}</a-button>
      </a-form-item>
    </a-form>
    <template #footer> </template>
  </a-modal>
</template>
