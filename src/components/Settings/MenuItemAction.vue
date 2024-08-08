<script setup>
import {
  ref,
  reactive,
  computed,
  defineProps,
  defineEmits,
  onUnmounted,
} from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import request, { handleRequest } from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps({
  type: "String",
  common: Object,
  menuId: String,
  data: Object,
});

const emit = defineEmits(["close"]);

const dataSubmit = reactive({
  title: props.data?.title ?? "",
  image: props.data?.image ?? "",
  description: props.data?.description ?? "",
  gameType: props.data?.gameType ?? "",
  providerId: props.data?.providerId ?? "",
  gameId: props.data?.gameId ?? "",
  openType: props.data?.openType ?? 0,
});

const showModal = ref(true);

const menuForm = ref(null);
const fileList = ref([]);
const gameProviderOptions = ref([]);
const gameOptions = ref([]);

const gameTypeOptions = computed(() => {
  return (props.common?.gameTypes || []).map((e) => {
    return {
      value: e.value,
      label: e.description,
    };
  });
});

if (props.data?.image) {
  fileList.value.push({
    uid: "-1",
    name: props.data.image,
    url: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.image,
    thumbUrl: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.image,
  });
}

function filterOption(inputValue, option) {
  const regex = new RegExp(inputValue, "i");
  return regex.test(option.label);
}

function onSelect(value) {
  dataSubmit.providerId = "";
  getGameProvider(value);
}

function onSelectProvider(value, option) {
  dataSubmit.gameId = "";
  setGameOptions(option);
}

function onFinish() {
  const data = { children: dataSubmit };

  if (props.type == "add") {
    handleRequest(
      request.post(api.SETTINGS_MENU_SUB_MENU(props.menuId), dataSubmit),
      (data) => {
        emit("updated", data.data);
      },
      $t("setting.addNewMenuSuc")
    );
  } else {
    handleRequest(
      request.patch(api.SETTINGS_MENU_SUB_MENU(props.menuId), {
        id: props.data._id,
        ...dataSubmit,
      }),
      (data) => {
        emit("updated", data.data);
      },
      eidtMenuSuc
    );
  }
}

function uploadImage({ onSuccess, file }) {
  const data = new FormData();
  data.append("file", file);
  handleRequest(
    request.post(api.UTIL_UPLOAD, data),
    async (res) => {
      dataSubmit.image = res.data;
      menuForm.value.validate();
      file.url = import.meta.env.VITE_APP_CDN_URL + "/" + res.data;
      onSuccess(file);
    },
    $t("setting.downloadImgeSuc")
  );
}

function onRemoveImage() {
  dataSubmit.image = "";
}

function getGameProvider(type) {
  const params = { type };
  const req = request.get(api.GAME_PROVIDERS, { params });
  handleRequest(req, (res) => {
    gameProviderOptions.value = res.data.map((e) => {
      const { providerId, provider, games } = e;
      return {
        value: providerId,
        label: provider,
        games,
      };
    });

    if (dataSubmit.providerId == 0 || dataSubmit.providerId) {
      const providerSelected = gameProviderOptions.value.find(
        (e) => dataSubmit.providerId === e.value
      );
      if (providerSelected) {
        setGameOptions(providerSelected);
      }
    }
  });
}

function setGameOptions(option) {
  gameOptions.value = option.games.map((e) => {
    const { gameId, gameInfos } = e;
    const name = gameInfos[0] ? gameInfos[0][0].gameName : "N/A";
    return {
      value: gameId,
      label: name,
    };
  });
}

if (dataSubmit.gameType === 0 || dataSubmit.gameType) {
  getGameProvider(dataSubmit.gameType);
}
</script>

<template>
  <a-modal
    v-model:open="showModal"
    @cancel="emit('close')"
    :title="type == 'edit' ? $t('edit') : $t('create')"
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
            {{ $t("upImage") }}
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item :label="$t('description')" name="description">
        <a-input v-model:value="dataSubmit.description"> </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('Giftcode.type')"
        name="gameType"
        :rules="[{ required: true, message: $t('setting.selectTypeGameEr') }]"
      >
        <a-select
          v-model:value="dataSubmit.gameType"
          style="width: 100%"
          :placeholder="$t('setting.selectTypeGame')"
          showSearch
          :filterOption="filterOption"
          :options="gameTypeOptions"
          @select="onSelect"
        ></a-select>
      </a-form-item>

      <a-form-item
        :label="$t('setting.supplier')"
        name="providerId"
        :rules="[{ required: true, message: $t('setting.supplierEr') }]"
      >
        <a-select
          v-model:value="dataSubmit.providerId"
          style="width: 100%"
          :placeholder="$t('setting.selectSuppliserPlaceholder')"
          showSearch
          :filterOption="filterOption"
          :options="gameProviderOptions"
          @select="onSelectProvider"
        ></a-select>
      </a-form-item>

      <a-form-item
        label="Game"
        name="gameId"
        :rules="[{ required: true, message: $t('setting.supplierEr') }]"
      >
        <a-select
          v-model:value="dataSubmit.gameId"
          style="width: 100%"
          :placeholder="$t('setting.selectGame')"
          showSearch
          :filterOption="filterOption"
          :options="gameOptions"
        ></a-select>
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
