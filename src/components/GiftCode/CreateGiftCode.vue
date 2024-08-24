<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import { MoreOutlined, CheckCircleOutlined } from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import { notification } from "ant-design-vue";

import request, { handleRequest } from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const emit = defineEmits(["close"]);

const showModal = ref(true);

const formState = reactive({
  type: 0,
  timeEnd: "",
  count: 0,
  code: "",
  amount: 0,
  event: "",
});
const createAccountForm = ref(null);

function closeModal() {
  emit("close");
}

async function onCreateGiftCode() {
  handleRequest(
    request.post(api.GIFTCODE_CREATE, formState),
    () => {
      emit("update");
    },
    $t("Giftcode.noitiGifSuc")
  );
}
</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('Giftcode.createGif')"
    :onCancel="closeModal"
  >
    <a-form
      ref="createAccountForm"
      :model="formState"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
    >
      <a-form-item :label="$t('Giftcode.typeGif')" name="region">
        <a-select
          v-model:value="formState.type"
          :placeholder="$t('Giftcode.seletGif')"
        >
          <a-select-option :value="0">{{
            $t("Giftcode.multipleUses")
          }}</a-select-option>
          <a-select-option :value="1">{{
            $t("Giftcode.limitedTime")
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :label="$t('Giftcode.event')"
        name="event"
        :rules="[{ required: true, message: $t('Giftcode.eventError') }]"
      >
        <a-input
          v-model:value="formState.event"
          :placeholder="$t('Giftcode.event')"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('Giftcode.numberOfuser')"
        v-if="formState.type === 0"
      >
        <a-form-item name="input-number" no-style>
          <a-input-number
            class="w-full"
            v-model:value="formState.count"
            :min="1"
            :max="10"
          />
        </a-form-item>
      </a-form-item>
      <a-form-item
        v-if="formState.type === 1"
        name="date-picker"
        :label="$t('Giftcode.expiryDate')"
        v-bind="config"
      >
        <a-date-picker
          v-model:value="formState.timeEnd"
          value-format="YYYY-MM-DD"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        :label="$t('Giftcode.codeGiftCode')"
        name="code"
        :rules="[{ required: true, message: $t('Giftcode.notiCodeErr') }]"
      >
        <a-input v-model:value="formState.code" />
      </a-form-item>
      <a-form-item :label="$t('Giftcode.amountOfMoney')" name="amount">
        <a-input-number class="w-full" v-model:value="formState.amount" />
      </a-form-item>

      <a-form-item class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("destroy")
        }}</a-button>
        <a-button @click="onCreateGiftCode" type="primary" html-type="submit">{{
          $t("Giftcode.createGif")
        }}</a-button>
      </a-form-item>
    </a-form>
    <template #footer> </template>
  </a-modal>
</template>
