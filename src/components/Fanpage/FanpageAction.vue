<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import {
  MoreOutlined,
  EditOutlined,
  DollarOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import EditFanpageModal from "./EditFanpageModal.vue";
import { notification } from "ant-design-vue";

import request from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps({
  data: Object,
});

const emit = defineEmits(["updated"]);

const isShowEditFanpageModal = ref(false);

function handleClickMenu(e) {
  switch (e.key) {
    case "edit":
      isShowEditFanpageModal.value = true;
      break;

    default:
      break;
  }
}

async function deleteFanpage() {
  try {
    const res = await request.delete(api.FANPAGE + "/" + props.data._id);
    if (res.ok) {
      emit("updated");
      notification.success({
        message: $t("delete_success"),
      });
    } else {
      notification.error({
        message: res.e ?? $t("error"),
      });
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: error.e ?? $t("error"),
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
          {{ $t("fanpage.edit") }}
        </a-menu-item>

        <a-menu-item key="delete">
          <a-popconfirm
            title="Are you sure delete this fanpage?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteFanpage"
          >
            <DeleteOutlined />
            {{ $t("fanpage.delete") }}
          </a-popconfirm>
        </a-menu-item>
      </a-menu>
    </template>
    <a-button type="primary" size="">
      <!-- Chi tiết -->
      <MoreOutlined />
    </a-button>
  </a-dropdown>

  <EditFanpageModal v-if="isShowEditFanpageModal" @close="isShowEditFanpageModal=false" :data="props.data" @updated="emit('updated')"/>
</template>
