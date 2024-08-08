<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import { MoreOutlined, EditOutlined } from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import { notification } from "ant-design-vue";
import ModalSendLetterPrivate from "@/components/Letter/ModalSendLetterPrivate.vue";

import request from "@/request";
import api from "@/request/api";

const props = defineProps({
  data: Object,
});

const emit = defineEmits(["updated"]);

const showModalSendPrivateLetter = ref(false);

const moneyData = reactive({
  amount: 0,
});

function handleClickMenu(e) {
  switch (e.key) {
    case "edit":
      moneyData.amount = 0;
      showModalSendPrivateLetter.value = true;
      break;

    default:
      break;
  }
}

function onUpdated() {
  emit("updated");
  showModalSendPrivateLetter.value = false;
}
</script>

<template>
  <a-dropdown>
    <template #overlay>
      <a-menu @click="handleClickMenu">
        <a-menu-item key="edit">
          <EditOutlined />
          {{ $t("Letter.btnSend") }}
        </a-menu-item>
      </a-menu>
    </template>
    <a-button type="primary" size="">
      <!-- Chi tiết -->
      <MoreOutlined />
    </a-button>
  </a-dropdown>
  <ModalSendLetterPrivate
    v-if="showModalSendPrivateLetter"
    @close="showModalSendPrivateLetter = false"
    :data="data"
    @updated="onUpdated"
  />
</template>
