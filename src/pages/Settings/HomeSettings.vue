<script setup>
import { onMounted, ref, reactive, nextTick, h } from "vue";
import request, { handleRequest } from "@/request";
import HomeSettingsAction from "@/components/Settings/HomeSettingsAction.vue";
import api from "@/request/api";
import { Modal } from "ant-design-vue";
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const bannerTableColumns = [
  {
    title: "STT",
    key: "index",
    customRender: ({ index }) => index + 1,
  },

  {
    title: $t("setting.imgae"),
    key: "image",
  },

  {
    title: $t("description"),
    dataIndex: "description",
  },

  {
    title: $t("action"),
    key: "action",
  },
];

const isShowHomeSettingsModal = ref(false);
const settingsType = ref(null);

const homeSettings = reactive({
  banner: [],
});

const bannerSelected = ref(null);

function getHomeSettings() {
  handleRequest(request.get(api.SETTINGS_HOME), (data) => {
    const { banner } = data.data;
    Object.assign(homeSettings, { banner });
  });
}

function updateHomeSettings() {
  handleRequest(request.put(api.SETTINGS_HOME), (data) => {});
}

function onCreateBanner() {
  settingsType.value = "add";
  bannerSelected.value = null;
  isShowHomeSettingsModal.value = true;
}

function imagePath(image) {
  return import.meta.env.VITE_APP_CDN_URL + "/" + image;
}

function submitDeleteBanner(item) {
  const banner = homeSettings.banner.filter((e) => e._id !== item._id);
  const data = {
    ...homeSettings,
    banner,
  };
  handleRequest(
    request.put(api.SETTINGS_HOME, data),
    (data) => {
      const { banner } = data.data;
      Object.assign(homeSettings, { banner });
    },
    $t("setting.deleteBannerSuc")
  );
}

function handleClickMenu(e, item) {
  switch (e.key) {
    case "edit":
      bannerSelected.value = item;
      isShowHomeSettingsModal.value = true;
      break;
    case "delete":
      Modal.confirm({
        title: $t("setting.confirmDeleteMenu ")`${item.title}`,
        icon: h(ExclamationCircleOutlined),
        content: "",
        okText: $t("delete"),
        onOk: () => submitDeleteBanner(item),
        cancelText: $t("destroy"),
      });
      break;
    default:
      break;
  }
}

function onUpdated(data) {
  const { banner } = data;
  Object.assign(homeSettings, { banner });
  isShowHomeSettingsModal.value = false;
}

getHomeSettings();
</script>

<template>
  <a-card :title="$t('setting.banners')">
    <a-button type="primary" class="mb-2" @click="onCreateBanner"
      ><PlusOutlined
    /></a-button>
    <a-table
      :columns="bannerTableColumns"
      :data-source="homeSettings.banner"
      :pagination="false"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'image'">
          <a-image :height="100" :src="imagePath(record.image)" />
        </template>
        <template v-if="column.key === 'action'">
          <a-dropdown>
            <template #overlay>
              <a-menu @click="(e) => handleClickMenu(e, record)">
                <a-menu-item key="edit">
                  <EditOutlined />
                  {{ $t("edit") }}
                </a-menu-item>
                <a-menu-item key="delete">
                  <DeleteOutlined />
                  {{ $t("delete") }}
                </a-menu-item>
              </a-menu>
            </template>
            <a-button type="primary" size="">
              <!-- Chi tiết -->
              <MoreOutlined />
            </a-button>
          </a-dropdown>
        </template>
      </template>
    </a-table>
  </a-card>
  <HomeSettingsAction
    v-if="isShowHomeSettingsModal"
    :type="settingsType"
    :data="bannerSelected"
    :settings="homeSettings"
    @updated="onUpdated"
    @close="isShowHomeSettingsModal = false"
  />
</template>
<style scoped></style>
