<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import { MoreOutlined, EditOutlined } from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import { notification } from "ant-design-vue";
import AddOrEditIp from "@/components/Settings/AddOrEditIp.vue";

import request from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps({
  data: Object,
});

const emit = defineEmits(["updated"]);

const showEditModal = ref(false);

const moneyData = reactive({
  amount: 0,
});

function handleClickMenu(e) {
  switch (e.key) {
    case "edit":
      moneyData.amount = 0;
      showEditModal.value = true;
      break;

    default:
      break;
  }
}

function onUpdated() {
  emit("updated");
  showEditModal.value = false;
}
</script>

<template>
  <a-dropdown>
    <template #overlay>
      <a-menu @click="handleClickMenu">
        <a-menu-item key="edit">
          <EditOutlined />
          {{ $t("edit") }}
        </a-menu-item>
      </a-menu>
    </template>
    <a-button type="primary" size="">
      <!-- Chi tiết -->
      <MoreOutlined />
    </a-button>
  </a-dropdown>
  <AddOrEditIp
    type="edit"
    v-if="showEditModal"
    @close="showEditModal = false"
    :data="data"
    @updated="onUpdated"
  />
</template>
