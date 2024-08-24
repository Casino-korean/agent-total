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

const formData = reactive({
  timeEnd: props.curtableData.timeEnd,
  count: props.curtableData.count,
  amount: props.curtableData.amount,
  event: props.curtableData.event
});
const createAccountForm = ref(null);

function closeModal() {
  emit("close");
}
async function onChangeGiftcode() {
  const submitData = {
    timeEnd: formData.timeEnd,
    count: formData.count,
    amount: formData.amount,
    event: formData.event,
  };
  handleRequest(
    request.put(api.GIFTCODE_CHANGE + `/${props.curtableData._id}`, submitData),
    () => {
      emit("update");
    },
    $t("Giftcode.noitiUpdateGif")
  );
}
</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('Giftcode.changeGif')"
    :onCancel="closeModal"
  >
    <a-form
      ref="createAccountForm"
      :model="formData"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
    > 
    <a-form-item :label="$t('Giftcode.event')" style="display: block">
        <a-form-item name="event" no-style>
          <a-input
            class="w-full"
            v-model:value="formData.event"
          />
        </a-form-item>
      </a-form-item>

      <a-form-item :label="$t('Giftcode.numberOfuser')" style="display: block">
        <a-form-item name="input-number" no-style>
          <a-input-number
            class="w-full"
            v-model:value="formData.count"
            :min="1"
            :max="10"
          />
        </a-form-item>
      </a-form-item>
      <a-form-item
        name="date-picker"
        :label="$t('Giftcode.expiryDate')"
        v-bind="config"
        :style="{ display: props.curtableData.type === 0 ? 'none' : 'block' }"
      >
        <a-date-picker
          v-model:value="formData.timeEnd"
          value-format="YYYY-MM-DD"
          class="w-full"
        />
      </a-form-item>

      <a-form-item
        :label="$t('Giftcode.amountOfMoney')"
        name="amount"
        style="display: block"
      >
        <a-input-number class="w-full" v-model:value="formData.amount" />
      </a-form-item>

      <a-form-item class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("destroy")
        }}</a-button>
        <a-button @click="onChangeGiftcode" type="primary" html-type="submit">{{
          $t("Giftcode.change")
        }}</a-button>
      </a-form-item>
    </a-form>
    <template #footer> </template>
  </a-modal>
</template>
