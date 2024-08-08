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
  settings: Object,
});

const form = ref(null);
const fileList = ref([]);
const fileListTablet = ref([]);
const fileListMoblie = ref([]);

if (props.data?.image) {
  fileList.value.push({
    uid: "-1",
    name: props.data.image,
    url: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.image,
    thumbUrl: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.image,
  });
}
if (props.data?.imageTablet) {
  fileListTablet.value.push({
    uid: "-1",
    name: props.data.imageTablet,
    url: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.imageTablet,
    thumbUrl: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.imageTablet,
  });
}
if (props.data?.imageMoblie) {
  fileListMoblie.value.push({
    uid: "-1",
    name: props.data.imageMoblie,
    url: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.imageMoblie,
    thumbUrl: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.imageMoblie,
  });
}

const dataSubmit = reactive({
  image: props.data?.image || "",
  imageTablet: props.data?.imageTablet || "",
  imageMoblie: props.data?.imageMoblie || "",
  description: props.data?.description || "",
});

const emit = defineEmits(["close", "updated"]);

const showModal = ref(true);

function onFinish() {
  let data = null;
  let message = null;
  if (props.type == "add") {
    const banner = [...props.settings.banner, dataSubmit];
    data = {
      ...props.settings,
      banner,
    };
    message = $t("setting.addBannersSuc");
  } else {
    const banner = props.settings.banner.map((e) => {
      return e._id !== props.data._id
        ? e
        : {
            _id: e._id,
            ...dataSubmit,
          };
    });
    data = {
      ...props.settings,
      banner,
    };
    message = $t("setting.editBannersSuc");
  }
  handleRequest(
    request.put(api.SETTINGS_HOME, data),
    (data) => {
      emit("updated", data.data);
    },
    message
  );
}

function uploadImage({ onSuccess, file }) {
  const data = new FormData();
  data.append("file", file);
  handleRequest(
    request.post(api.UTIL_UPLOAD, data),
    async (res) => {
      dataSubmit.image = res.data;
      await form.value.validate();
      file.url = import.meta.env.VITE_APP_BASE_URL + "/" + res.data;
      onSuccess(file);
    },
    $t("setting.downloadImgeSuc")
  );
}

function uploadImageTablet({ onSuccess, file }) {
  const data = new FormData();
  data.append("file", file);
  handleRequest(
    request.post(api.UTIL_UPLOAD, data),
    async (res) => {
      dataSubmit.imageTablet = res.data;
      await form.value.validate();
      file.url = import.meta.env.VITE_APP_BASE_URL + "/" + res.data;
      onSuccess(file);
    },
    $t("setting.downloadImgeSuc")
  );
}

function uploadImageMoblie({ onSuccess, file }) {
  const data = new FormData();
  data.append("file", file);
  handleRequest(
    request.post(api.UTIL_UPLOAD, data),
    async (res) => {
      dataSubmit.imageMoblie = res.data;
      await form.value.validate();
      file.url = import.meta.env.VITE_APP_BASE_URL + "/" + res.data;
      onSuccess(file);
    },
    $t("setting.downloadImgeSuc")
  );
}

function onRemoveImage() {
  dataSubmit.image = "";
}
function onRemoveImageTablet() {
  dataSubmit.imageTablet = "";
}
function onRemoveImageMoblie() {
  dataSubmit.imageMoblie = "";
}
</script>

<template>
  <a-modal
    v-model:open="showModal"
    @cancel="emit('close')"
    :title="
      type == 'edit' ? $t('setting.editBanners') : $t('setting.createNewBanner')
    "
  >
    <a-form
      ref="form"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
      @finish="onFinish"
    >
      <a-form-item
        :label="$t('setting.imgae')"
        name="image"
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
            {{ $t("dowloadImage") }}
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item
        :label="$t('setting.imageTable')"
        name="image"
        :rules="[{ required: true, message: $t('setting.imageNoitiEr') }]"
      >
        <a-upload
          accept="image/*"
          v-model:file-list="fileListTablet"
          :customRequest="uploadImageTablet"
          :maxCount="1"
          list-type="picture"
          @remove="onRemoveImageTablet"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            {{ $t("dowloadImage") }}
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item
        :label="$t('setting.imageMoblie')"
        name="image"
        :rules="[{ required: true, message: $t('setting.imageNoitiEr') }]"
      >
        <a-upload
          accept="image/*"
          v-model:file-list="fileListMoblie"
          :customRequest="uploadImageMoblie"
          :maxCount="1"
          list-type="picture"
          @remove="onRemoveImageMoblie"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            {{ $t("dowloadImage") }}
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item :label="$t('description')" name="description">
        <a-input v-model:value="dataSubmit.description"> </a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 11 }">
        <a-button type="primary" html-type="submit">{{ $t("add") }}</a-button>
      </a-form-item>
    </a-form>

    <template #footer>
      <!--  -->
    </template>
  </a-modal>
</template>
