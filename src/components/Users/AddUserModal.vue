<script setup>
import { reactive, computed, ref, defineProps } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import { notification } from "ant-design-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const showModal = ref(true);
const emit = defineEmits(["close"]);

function closeModal() {
  emit("close");
}

const dataSubmit = reactive({
  username: "",
  password: "",
  phone: "",
  vip: 0,
  bankName: "",
  accountNumber: "",
  accountName: ""
});

const banksList = ref([]);

const vipOptions = Array.from(Array(9).keys()).map((e) => {
  return {
    value: e,
    label: e
  }
})

const getListBank = async () => {
  try {
    const res = await request.get(api.ADMIN_BANK);
    if (res.ok) {
      banksList.value = res.d.map((e) => {
        return {
          value: e.bankName,
          label: e.bankName,
        };
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const submitAddUser = async () => {
  try {
    const data = {};
    Object.keys(dataSubmit).forEach((k) => {
      if (dataSubmit[k] !== "") {
        data[k] = dataSubmit[k];
      }
    });
    data.isBankConfig =
      data.bankName && data.accountNumber && data.accountName ? 1 : 0;
    const res = await request.post(api.USER_ADD, data);
    if (res.ok) {
      emit("updated");
      notification.success({
        message: $t("User.addUserSuc"),
      });
      closeModal();
    } else {
      notification.error({
        message: res.e ?? $t("User.updateUserEr"),
      });
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: error.e ?? $t("User.updateUserEr"),
    });
  }
};

getListBank();
</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('User.addUser')"
    :onCancel="closeModal"
    :footer="null"
  >
    <a-form
      ref="createAccountForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item
        :label="$t('User.userName')"
        name="username"
        :rules="[
          { required: true, message: $t('User.userName') },
          { min: 6, message: $t('User.userName') },
        ]"
      >
        <a-input
          :placeholder="$t('User.usernamePlace')"
          v-model:value.trim="dataSubmit.username"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('User.pass')"
        name="password"
        :rules="[
          { required: true, message: $t('User.passErr') },
          { min: 6, message: $t('User.passErr') },
        ]"
      >
        <a-input-password
          :placeholder="$t('User.passPlace')"
          v-model:value="dataSubmit.password"
        >
        </a-input-password>
      </a-form-item>

      <a-form-item
        :label="$t('User.phone')"
        name="phone"
        :rules="[{ required: true, message: $t('User.phoneErr') }]"
      >
        <a-input
          :placeholder="$t('User.phonePlace')"
          v-model:value.trim="dataSubmit.phone"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        label="Vip"
        name="vip"
        :rules="[{ required: true, message: $t('User.vipError') }]"
      >
        <a-select
          :placeholder="$t('User.vipPlace')"
          :options ="vipOptions"
          v-model:value="dataSubmit.vip"
        >
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('User.bank')" name="bankName">
        <a-select
          :options="banksList"
          :placeholder="$t('User.bankPlace')"
          v-model:value="dataSubmit.bankName"
        >
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('User.acccout')" name="bankName">
        <a-input
          :options="banksList"
          :placeholder="$t('placeAcoutName')"
          v-model:value.trim="dataSubmit.accountNumber"
        >
        </a-input>
      </a-form-item>

      <a-form-item :label="$t('User.acoutName')" name="bankName">
        <a-input
          :options="banksList"
          :placeholder="$t('placeAcOwen')"
          v-model:value.trim="dataSubmit.accountName"
        >
        </a-input>
      </a-form-item>

      <div class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("User.destroy")
        }}</a-button>
        <a-button @click="submitAddUser" type="primary" html-type="submit">{{
          $t("User.send")
        }}</a-button>
        <!-- </div> -->
      </div>
    </a-form>
  </a-modal>
</template>
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
