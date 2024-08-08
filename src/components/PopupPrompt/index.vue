<template>
  <a-button type="primary" @click="isShowPopupModal = true">
    {{ $t("fanpage.add_btn") }}</a-button
  >

  <div class="overflow-y-auto mt-2">
    <a-table
      :columns="columns"
      :data-source="tableData.data"
      :pagination="pagination"
      :loading="tableData.loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'show'">
          <a-badge
            :count="statusText(record.show)"
            :number-style="{ backgroundColor: statusColor(record.show) }"
          />
        </template>
        <template v-if="column.key === 'action'">
          <PopupAction
            :data="record"
            @updated="onUpdated"
          />
        </template>
      </template>
    </a-table>
  </div>

  <PopupModal
    type="create"
    v-if="isShowPopupModal"
    @close="isShowPopupModal = false"
    @updated="onUpdated"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import api from "@/request/api";
import request from "@/request";
import { formatDateTime } from "@/helpers/format";

import PopupModal from "./PopupModal.vue";
import PopupAction from "./PopupAction.vue"

const { t: $t } = useI18n({ useScope: "global" });

const isShowPopupModal = ref(false);
const queryParams = reactive({
  page: 1,
  limit: 10,
});

const columns = [
  {
    title: $t('popup.title'),
    dataIndex: "title",
  },

  {
    title: $t('popup.show'),
    key: "show",
  },

  {
    title: "Thời gian sáng tạo",
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },

  {
    title: "Biên tập",
    key: "action",
  },
];

const tableData = reactive({
  data: [],
  loading: false,
  total: 0,
});

const pagination = computed(() => ({
  total: tableData.total,
  showSizeChanger: false,
  current: queryParams.page,
  pageSize: queryParams.limit,
}));

const handleTableChange = async (pag, _, __) => {
  const { current, pageSize, total } = pag;
  queryParams.page = current;
  queryParams.limit = pageSize;
  tableData.total = total;
  await getListPopup()
};

const getListPopup = async () =>{
    try{
      tableData.loading = true
      const res = await request.get(api.ADMIN_POPUP_LIST, {params: queryParams});
      if (res.ok) {
        tableData.total = res.d.total;
        tableData.data = res.d.data;
      }
  } catch (error) {
    console.log(error);
  } finally {
    tableData.loading = false;
  }
}

const statusText = (show) => {
  switch (show) {
    case 0:
      return $t("popup.hide");
    case 1:
      return $t("popup.show");
    default:
      return isWin;
  }
}

const statusColor = (show) => {
  switch (show) {
    case 0:
      return "#dc3545";
    case 1:
      return "#28a745";
    default:
      return "#6c757d";
  }
}

function onUpdated(record, payload) {
  getListPopup();
}

onMounted(async()=>{
  await getListPopup();
})

</script>

<style lang="">
</style>