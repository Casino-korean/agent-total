
<script setup>
import { ref, defineProps, defineEmits } from "vue";
import {
  DeleteFilled,
  EditFilled,
} from "@ant-design/icons-vue";
import AdminModel from "./AdminModal.vue"

import { formatNumber, formatDateTime } from "@/helpers/format";
import { notification } from "ant-design-vue";

import request, { handleRequest } from "@/request";
import api from "@/request/api";

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  isAdd: {
    type: Boolean,
    default: false,
  },
  showEditModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["updated"]);

const submitDelete = () => {
  handleRequest(
    request.delete(api.AGENT_CHANGE + "/" + props.data._id),
    (res) => {
      emit("updated")
    },
    "Xóa thành công."
  );
};
</script>

<template>
  <a-space>
    <a-button style="color: red" @click="showEditModal = true, isAdd=false">
      <template #icon>
        <EditFilled />
      </template>
    </a-button>

    <a-popconfirm
      title="Bạn có chắc muốn xóa dữ liệu này không?"
      ok-text="Xác nhận"
      cancel-text="Hủy"
      @confirm="submitDelete"
    >
      <a-button style="color: red" >
        <template #icon>
          <DeleteFilled />
        </template>
      </a-button>
    </a-popconfirm>
  </a-space>
  <AdminModel type="edit" :data="props.data" @updated="emit('updated')" v-if="showEditModal" @close="emit('close'), showEditModal=false" :type="isAdd ? 'create' : 'update'"/>
</template>
