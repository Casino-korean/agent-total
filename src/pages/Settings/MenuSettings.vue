<script setup>
import { ref, h, reactive } from "vue";
import SettingsMenuAction from "@components/Settings/SettingsMenuAction.vue";
import MenuItemsTable from "@components/Settings/MenuItemsTable.vue";

import request, { handleRequest } from "@/request";
import { Modal } from "ant-design-vue";
import { EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";

import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const activeKey = ref(0);

const isShowMenuModal = ref(false);
const menuList = ref([]);
const menuActionType = ref("add");
const menuEditting = ref(null);
const commonData = reactive({});

async function getMenu() {
  const req = request.get(api.SETTINGS_MENU_GET);
  handleRequest(req, (res) => {
    menuList.value = res.data;
  });
}

async function getCommonData() {
  const req = request.get(api.GAME_COMMON);
  handleRequest(req, (res) => {
    Object.assign(commonData, res.data);
  });
}

async function confirmDeleteMenu(item) {
  const req = () => request.delete(api.SETTINGS_MENU_DELETE(item._id));
  Modal.confirm({
    title: $t("setting.confirmDeleteMenu")`${item.title}`,
    icon: h(ExclamationCircleOutlined),
    content: "",
    okText: $t("delete"),
    onOk: () => handleRequest(req(), () => getMenu(), $t("setting.deleteMenu")),
    cancelText: $t("destroy"),
  });
}

function onNewMenu(data) {
  getMenu();
  isShowMenuModal.value = false;
}

function onUpdatedMenu(data) {
  const menu = menuList.value.find((e) => e._id == data._id);
  Object.assign(menu, data);
  isShowMenuModal.value = false;
}

function showAddMenu() {
  menuEditting.value = null;
  menuActionType.value = "add";
  isShowMenuModal.value = true;
}

function showEditMenu(menu) {
  menuEditting.value = menu;
  menuActionType.value = "edit";
  isShowMenuModal.value = true;
}

const onEditTabs = (targetKey, action) => {
  if (action === "add") {
    showAddMenu();
  } else {
    confirmDeleteMenu(menuList.value[targetKey]);
  }
};

getCommonData();
getMenu();
</script>

<template>
  <a-button type="primary" @click="showAddMenu">{{ $t("add") }}</a-button>
  <a-tabs
    v-model:activeKey="activeKey"
    class="mt-2"
    type="editable-card"
    @edit="onEditTabs"
  >
    <a-tab-pane
      v-for="(menu, index) in menuList"
      :key="index"
      :tab="menu.title"
    >
      <a-button
        type="primary"
        shape="circle"
        :icon="h(EditOutlined)"
        @click="showEditMenu(menu)"
      />
      <p>
        {{ $t("title") }} <b>{{ menu.title }}</b>
      </p>
      <MenuItemsTable :data="menu" :common="commonData" />
    </a-tab-pane>
  </a-tabs>

  <SettingsMenuAction
    v-if="isShowMenuModal"
    :type="menuActionType"
    :data="menuEditting"
    @close="isShowMenuModal = false"
    @new="onNewMenu"
    @updated="onUpdatedMenu"
  />
</template>
