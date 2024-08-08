<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import {
  MoreOutlined,
  EditOutlined,
  DollarOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import EditAppModal from "./EditAppDownloadModal.vue";
import { notification } from "ant-design-vue";

import request from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps({
  data: Object,
});

const emit = defineEmits(["updated"]);

const isShowEditModal = ref(false);

function handleClickMenu(e) {
  switch (e.key) {
    case "edit":
      isShowEditModal.value = true;
      break;

    default:
      break;
  }
}

async function deleteApp() {
  try {
    const res = await request.delete(api.APP_DOWNLOAD + "/" + props.data._id);
    if (res.ok) {
      emit("updated");
      notification.success({
        message: $t("app_download.delete_success"),
      });
    } else {
      notification.error({
        message: res.e ?? $t("app_download.delete_error"),
      });
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: error.e ?? $t("app_download.delete_error"),
    });
  }
}
</script>

<template>
  <a-dropdown>
    <template #overlay>
      <a-menu @click="handleClickMenu">
        <a-menu-item key="edit">
          <EditOutlined />
          {{ $t("app_download.edit") }}
        </a-menu-item>

        <a-menu-item key="delete">
          <a-popconfirm
            title="Are you sure delete this app?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteApp"
          >
            <DeleteOutlined />
            {{ $t("app_download.delete") }}
          </a-popconfirm>
        </a-menu-item>
      </a-menu>
    </template>
    <a-button type="primary" size="">
      <!-- Chi tiết -->
      <MoreOutlined />
    </a-button>
  </a-dropdown>

  <EditAppModal v-if="isShowEditModal" @close="isShowEditModal=false" :data="props.data" @updated="emit('updated')"/>
</template>
