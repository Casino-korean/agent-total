<template>
  <a-modal :title="title" v-model:open="show" :onCancel="close">
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
        :label="$t('name')"
        name="name"
        :rules="[{ required: true, message: $t('setting.nameEr') }]"
      >
        <a-input v-model:value="dataSubmit.name"> </a-input>
      </a-form-item>

      <a-form-item
        label="IP"
        name="ip"
        :rules="[{ required: true, message: $t('setting.ipEr') }]"
      >
        <a-input v-model:value="dataSubmit.ip"> </a-input>
      </a-form-item>

      <a-form-item class="flex justify-end">
        <a-button @click="close" class="mr-2">{{ $t("destroy") }}</a-button>
        <a-button type="primary" html-type="submit"> {{ $t("add") }}</a-button>
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
const dataSubmit = reactive({
  name: "",
  ip: "",
});

const props = defineProps({
  type: {
    type: String,
    default: "create",
  },
  data: Object,
});

if (props.data) {
  dataSubmit.name = props.data.name;
  dataSubmit.ip = props.data.ip;
}

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
const title = computed(() => {
  return props.type === "create"
    ? $t("setting.addNewIp")
    : $t("setting.editIp");
});

const onFinish = (values) => {
  if (props.type === "create") submitCreate();
  else submitEdit();
};

async function submitCreate() {
  try {
    const res = await request.post(api.SETINGS_IP_ALLOW_CREATE, dataSubmit);
    if (res.ok) {
      notification.success({
        message: $t("setting.noitiSucIp"),
      });
      emit("updated", res.data);
    } else {
      throw res;
    }
  } catch (error) {
    notification.error({
      message: error.e,
    });
  }
}

async function submitEdit() {
  try {
    const res = await request.put(
      api.SETINGS_IP_ALLOW_EDIT + props.data._id,
      dataSubmit
    );
    if (res.ok) {
      notification.success({
        message: $t("setting.noitiEditSuc"),
      });
      emit("updated", res.data);
    } else {
      throw res;
    }
  } catch (error) {
    notification.error({
      message: error.e,
    });
  }
}

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>
<style lang=""></style>
