<script setup>
import { ref, reactive, defineProps, defineEmits, onUnmounted } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import request, { handleRequest } from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps({
  type: String,
  common: Object,
  data: Object,
});

const menuForm = ref(null);
const fileList = ref([]);

if (props.data?.icon) {
  fileList.value.push({
    uid: "-1",
    name: props.data.icon,
    url: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.icon,
    thumbUrl: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.icon,
  });
}
const dataSubmit = reactive({
  title: props.data?.title || "",
  icon: props.data?.icon || "",
  description: props.data?.description || "",
});

const emit = defineEmits(["close"]);

const showModal = ref(true);

function onFinish() {
  if (props.type == "add") {
    handleRequest(
      request.post(api.SETTINGS_MENU_CREATE, dataSubmit),
      (data) => {
        emit("new", data.data);
      },
      $t("setting.addNewMenuSuc")
    );
  } else {
    handleRequest(
      request.patch(api.SETTINGS_MENU_UPDATE(props.data._id), dataSubmit),
      (data) => {
        emit("updated", data.data);
      },
      $t("setting.eidtMenuSuc")
    );
  }
}

function uploadImage({ onSuccess, file }) {
  const data = new FormData();
  data.append("file", file);
  handleRequest(
    request.post(api.UTIL_UPLOAD, data),
    async (res) => {
      dataSubmit.icon = res.data;
      await menuForm.value.validate();
      file.url = import.meta.env.VITE_APP_CDN_URL + "/" + res.data;
      onSuccess(file);
    },
    $t("setting.downloadImgeSuc")
  );
}

function onRemoveImage() {
  dataSubmit.icon = "";
}
</script>

<template>
  <a-modal
    v-model:open="showModal"
    @cancel="emit('close')"
    :title="type == 'edit' ? $t('setting.eidtMenu') : $t('setting.createMenu')"
  >
    <a-form
      ref="menuForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
      @finish="onFinish"
    >
      <a-form-item
        :label="$t('title')"
        name="title"
        :rules="[{ required: true, message: $t('Letter.caption_err') }]"
      >
        <a-input v-model:value="dataSubmit.title"> </a-input>
      </a-form-item>
      <a-form-item
        label="Icon"
        name="icon"
        :rules="[{ required: true, message: $t('setting.imageNoitiEr') }]"
      >
        <a-upload
          accept="image/*"
          v-model:file-list="fileList"
          :customRequest="uploadImage"
          :maxCount="1"
          list-type="picture"
          @remove="onRemoveImage"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            {{ $t("upImage") }}
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item :label="$t('description')" name="description">
        <a-input v-model:value="dataSubmit.description"> </a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 11 }">
        <a-button type="primary" html-type="submit">
          {{ $t("User.send") }}</a-button
        >
      </a-form-item>
    </a-form>

    <template #footer>
      <!--  -->
    </template>
  </a-modal>
</template>
