<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import { MoreOutlined, CheckCircleOutlined } from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import { notification } from "ant-design-vue";

import request, { handleRequest } from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const emit = defineEmits(["created", "close"]);

const showModal = ref(true);

const formState = reactive({
  password: "",
  passwordConfirm: "",
  // currency: "",
});
const currencyList = ref([]);
const createAccountForm = ref(null);

async function submitCreateAgent() {
  handleRequest(
    request.post(api.PASSWORD_CHANGE, { password: formState.password }),
    (data) => {
      emit("close");
    },
    $t("ChangePass.noitiChangePassSuc")
  );
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

const validatePassConfirm = async (_rule, value) => {
  if (value === "") {
    return Promise.reject($t("ChangePass.changePassER1"));
  } else if (value !== formState.password) {
    return Promise.reject($t("ChangePass.changePassEr2"));
  } else {
    return Promise.resolve();
  }
};
</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('changePass')"
    :onCancel="closeModal"
  >
    <a-form
      ref="createAccountForm"
      :model="formState"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        :label="$t('Login.password')"
        name="password"
        :rules="[{ required: true, message: $t('Partner.nameLogEr') }]"
      >
        <a-input-password v-model:value="formState.password">
        </a-input-password>
      </a-form-item>

      <a-form-item
        :label="$t('ChangePass.confirmPass')"
        name="passwordConfirm"
        :rules="[
          { required: true, validator: validatePassConfirm, trigger: 'change' },
        ]"
      >
        <a-input-password v-model:value="formState.passwordConfirm">
        </a-input-password>
      </a-form-item>

      <a-form-item class="flex justify-end">
        <a-button type="primary" html-type="submit">{{
          $t("User.send")
        }}</a-button>
      </a-form-item>
    </a-form>
    <template #footer>
      <!-- <a-button type="primary" @click="submitCreateAgent">Gửi</a-button> -->
    </template>
  </a-modal>
</template>
