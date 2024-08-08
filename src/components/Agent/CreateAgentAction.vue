<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import { MoreOutlined, CheckCircleOutlined } from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import { notification } from "ant-design-vue";

import request from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const emit = defineEmits(["created", "close"]);

const showModal = ref(true);

const dataSubmit = reactive({
  name: "",
  username: "",
  password: "",
  parentUsername: "",
  phone: "",
  location: "",
  facebook: "",
  telegram: "",
  precentCommissionGame: 1.1,
  precentCommissionLive: 0.9,
});
const createAccountForm = ref(null);

async function submitCreateAgent() {
  try {
    const res = await request.post(api.AGENT_CREATE, dataSubmit);
    if (res.ok) {
      notification.success({
        message: $t("Partner.noitiNewAgentSuc"),
      });
      emit("created");
    } else {
      throw res;
    }
  } catch (error) {
    notification.error({
      message: error.e,
    });
  }
}

const onFinish = (values) => {
  submitCreateAgent();
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function closeModal() {
  emit("close");
}
</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('Partner.createNewAgent')"
    :onCancel="closeModal"
    :width="600"
  >
    <a-form
      ref="createAccountForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        :label="$t('Partner.nameParter')"
        name="name"
        :rules="[{ required: true, message: $t('Partner.nameAgentEr') }]"
      >
        <a-input v-model:value="dataSubmit.name" />
      </a-form-item>

      <a-form-item
        :label="$t('userName')"
        name="username"
        :rules="[{ required: true, message: $t('Partner.nameLogEr') }]"
      >
        <a-input v-model:value="dataSubmit.username" />
      </a-form-item>

      <a-form-item
        :label="$t('Login.password')"
        name="password"
        :rules="[
          { required: true, message: $t('Partner.passLogEr') },
          {
            min: 6,
            message: $t('Partner.warringPass'),
          },
        ]"
      >
        <a-input-password v-model:value="dataSubmit.password" />
      </a-form-item>

      <a-form-item :label="$t('Partner.nameLogUper')" name="parentUsername">
        <a-input v-model:value="dataSubmit.parentUsername" />
      </a-form-item>

      <a-form-item :label="$t('Partner.phone')" name="phone">
        <a-input v-model:value="dataSubmit.phone" />
      </a-form-item>

      <a-form-item :label="$t('Partner.address')" name="location">
        <a-input v-model:value="dataSubmit.location" />
      </a-form-item>

      <a-form-item :label="$t('Partner.facebook')" name="facebook">
        <a-input v-model:value="dataSubmit.facebook" />
      </a-form-item>

      <a-form-item :label="$t('Partner.telegram')" name="telegram">
        <a-input v-model:value="dataSubmit.telegram" />
      </a-form-item>

      <a-form-item
        :label="$t('Partner.commisionGame')"
        name="precentCommissionGame"
      >
        <a-input-number
          class="w-full"
          v-model:value="dataSubmit.precentCommissionGame"
        />
      </a-form-item>

      <a-form-item
        :label="$t('Partner.commisionLive')"
        name="precentCommissionLive"
      >
        <a-input-number
          class="w-full"
          v-model:value="dataSubmit.precentCommissionLive"
        />
      </a-form-item>

      <a-form-item class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("destroy")
        }}</a-button>
        <a-button type="primary" html-type="submit">{{ $t("add") }}</a-button>
      </a-form-item>
    </a-form>
    <template #footer> </template>
  </a-modal>
</template>
