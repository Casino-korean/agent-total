<script setup>
import { reactive, computed, ref, h, defineProps } from "vue";
import request, { handleRequest } from "@/request";
import api from "@/request/api";
import { Modal } from "ant-design-vue";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import MenuItemAction from "./MenuItemAction.vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps({
  common: Object,
  data: Object,
});

const columns = [
  {
    title: $t("title"),
    dataIndex: "title",
  },
  {
    title: $t("description"),
    dataIndex: "description",
  },
  {
    title: $t("image"),
    key: "image",
  },

  {
    title: $t("action"),
    key: "action",
  },
];

const searchTxt = ref("");
const tableData = ref(props.data.children ?? []);
const isShowActionModal = ref(false);
const itemActionType = ref("add");
const itemEditting = ref(null);

function showAddItemModal() {
  itemEditting.value = null;
  itemActionType.value = "add";
  isShowActionModal.value = true;
}

function showEditItemModal(item) {
  itemEditting.value = item;
  itemActionType.value = "edit";
  isShowActionModal.value = true;
}

async function confirmDeleteMenu(item) {
  const req = () =>
    request.delete(api.SETTINGS_MENU_SUB_MENU(props.data._id), {
      params: { subId: item._id },
    });
  Modal.confirm({
    title: $t("setting.confirmDeleteMenu")`${item.title}`,
    icon: h(ExclamationCircleOutlined),
    content: "",
    okText: $t("delete"),
    onOk: () =>
      handleRequest(
        req(),
        (data) => {
          tableData.value = data.data.children;
        },
        $t("setting.deleteMenu")
      ),
    cancelText: $t("destroy"),
  });
}

function handleClickMenu(e, item) {
  switch (e.key) {
    case "edit":
      showEditItemModal(item);
      break;

    case "delete":
      confirmDeleteMenu(item);
      break;

    default:
      break;
  }
}

function imagePath(image) {
  return import.meta.env.VITE_APP_CDN_URL + "/" + image;
}

function onUpdatedItem(data) {
  tableData.value = data.children;
}
</script>

<template>
  <div class="my-2 flex flex-wrap gap-4">
    <div class="flex gap-2">
      <a-button
        type="primary"
        :icon="h(PlusCircleOutlined)"
        @click="showAddItemModal"
      ></a-button>
    </div>
    <a-input
      :placeholder="$t('name')"
      class="w-[200px]"
      v-model:value="searchTxt"
    ></a-input>
  </div>
  <a-table :columns="columns" :data-source="tableData">
    <template #bodyCell="{ column, record }">
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

  <MenuItemAction
    v-if="isShowActionModal"
    :type="itemActionType"
    :menuId="props.data._id"
    :data="itemEditting"
    :common="props.common"
    @close="isShowActionModal = false"
    @updated="onUpdatedItem"
  />
</template>
