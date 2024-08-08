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
const props = defineProps(["curtableData"]);
const emit = defineEmits(["close"]);

function closeModal() {
  emit("close");
}

const dataSubmit = reactive({
  password: "",
  bankName: props.curtableData.bankName ?? "",
  accountNumber: props.curtableData.accountNumber ?? "",
  accountName: props.curtableData.accountName ?? "",
});

const banksList = ref([]);

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

const submitEditUser = async () => {
  try {
    const data = {};
    Object.keys(dataSubmit).forEach((k) => {
      if (dataSubmit[k]) {
        data[k] = dataSubmit[k];
      }
    });
    data.isBankConfig =
      data.bankName && data.accountNumber && data.accountName ? 1 : 0;
    const res = await request.patch(
      api.USER_EDIT + "/" + props.curtableData._id,
      data
    );
    if (res.ok) {
      emit("updated");
      notification.success({
        message: $t("User.updateUserSuc"),
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
    :title="
      $t('User.editUser') +
      (props.curtableData.displayName ?? props.curtableData.username)
    "
    :onCancel="closeModal"
    :footer="null"
  >
    <a-form
      ref="createAccountForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
    >
      <a-form-item
        :label="$t('User.pass')"
        name="password"
        :rules="[{ min: 6, message: $t('User.passErr') }]"
      >
        <a-input-password
          :placeholder="$t('User.passPlace')"
          v-model:value="dataSubmit.password"
        >
        </a-input-password>
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
          v-model:value="dataSubmit.accountNumber"
        >
        </a-input>
      </a-form-item>

      <a-form-item :label="$t('User.acoutName')" name="bankName">
        <a-input
          :options="banksList"
          :placeholder="$t('placeAcOwen')"
          v-model:value="dataSubmit.accountName"
        >
        </a-input>
      </a-form-item>

      <a-form-item class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("User.destroy")
        }}</a-button>
        <a-button @click="submitEditUser" type="primary" html-type="submit">{{
          $t("User.send")
        }}</a-button>
      </a-form-item>
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
