<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import { MoreOutlined, EditOutlined } from "@ant-design/icons-vue";
import PopupModal from "./PopupModal.vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps({
  data: Object,
});

const emit = defineEmits(["updated"]);

const showEditModal = ref(false);

function handleClickMenu(e) {
  switch (e.key) {
    case "edit":
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
  <PopupModal
    type="update"
    :data="data"
    v-if="showEditModal"
    @close="showEditModal = false"
    @updated="onUpdated"
  />
</template>
