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
const props = defineProps(["curtableData"]);

const showModal = ref(true);

const dataSubmit = reactive({
  username: props.curtableData.username,
  password: '',
  phone: props.curtableData.phone,
});
const createAccountForm = ref(null);

function closeModal() {
  emit("close");
}
async function onChangeAgent() {
  const dataSend = {
    username: dataSubmit.username,
    password: dataSubmit.password,
    phone: dataSubmit.phone
  };
  handleRequest(
    request.patch(api.GENERAL_AGENT + `${props.curtableData._id}`, dataSend),
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

      <a-form-item :label="$t('User.phone')" name="phone">
        <a-input
          v-model:value="dataSubmit.phone"
        />
      </a-form-item>

      <a-form-item :label="$t('Partner.ReferralCode')" name="ReferralCode">
        <a-input
          :disabled="true"
          :rules="[{ required: true, message: $t('Partner.ReferralCode') }]"
          v-model:value="dataSubmit.refCode"
        />
      </a-form-item>

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
