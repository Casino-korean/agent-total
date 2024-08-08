<template>
  <a-modal :title="$t('Letter.title')" v-model:open="show" :onCancel="close">
    <a-form
      ref="createAccountForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
    >
      <a-form-item
        :label="$t('Letter.caption')"
        name="title"
        :rules="[{ required: true, message: $t('Letter.caption_err') }]"
      >
        <a-input
          :placeholder="$t('Letter.caption_placeholder')"
          v-model:value="dataSubmit.title"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('Letter.content')"
        name="content"
        :rules="[{ required: true, message: $t('Letter.content_err') }]"
      >
        <a-textarea
          v-model:value="dataSubmit.content"
          :placeholder="$t('Letter.content_placeholder')"
          :rows="4"
        />
      </a-form-item>

      <a-form-item class="flex justify-end">
        <a-button @click="close" class="mr-2">{{
          $t("Letter.destroy")
        }}</a-button>
        <a-button
          @click="submitSendPrivateLetter"
          type="primary"
          html-type="submit"
          >{{ $t("Letter.btnSend") }}</a-button
        >
      </a-form-item>
    </a-form>
    <template #footer> </template>
  </a-modal>
</template>
<script setup>
import { computed, reactive, ref } from "vue";
import { notification } from "ant-design-vue";

import request from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const show = ref(true);

const props = defineProps(["curtableData"]);
const dataSubmit = reactive({
  userIDReceiver: props.curtableData._id,
  title: "",
  content: "",
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}

async function submitSendPrivateLetter() {
  try {
    const res = await request.post(api.LETTER_CTEATE, dataSubmit);
    if (res.ok) {
      notification.success({
        message: $t("Letter.noitiPrivateSuc"),
      });
      emit("updated");
    } else {
      throw res;
    }
  } catch (error) {
    notification.error({
      message: error.e,
    });
  }
}
</script>
