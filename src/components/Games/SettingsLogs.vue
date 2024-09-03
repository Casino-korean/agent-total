<template>
  <div class="overflow-y-auto mt-4">
    <h2>Lịch sử cài đặt</h2>
    <a-table
      :columns="columns"
      :data-source="tableData.data"
      :pagination="pagination"
      :loading="tableData.loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'value'">
          <template v-if="props.formatValue">
            <div v-html="props.formatValue(record.value)"></div>
          </template>
          <div v-else>
            {{ record.value }}
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import SettingsLogs from "@/components/Games/SettingsLogs.vue";

import {
  MoreOutlined,
  HistoryOutlined,
  EditOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";

const columns = [
  {
    title: "Phiên",
    dataIndex: "seq",
  },

  {
    title: "Mô tả",
    dataIndex: "descriptions",
  },

  {
    title: "giá trị",
    key: "value",
    // customRender: ({ text }) => String(text)
  },
  {
    title: "Thời gian",
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },
];

const props = defineProps(["data", "formatValue"]);
const emit = defineEmits(["fetchData"])
const filterDate = ref([dayjs().startOf("days"), dayjs()]);

const queryParams = reactive({
  page: 1,
  limit: 10,
  from: new Date(
    filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  ).toISOString(),
  to: new Date(filterDate.value[1].format("YYYY-MM-DD 23:59:59")).toISOString(),
  s: null,
});

const tableData = computed(() => {
  return {
    data: props.data.data,
    loading: false,
    total: props.data.total
  };
});
const pagination = computed(() => ({
  total: props.data.total,
  current: queryParams.page,
  pageSize: queryParams.limit,
}));

const handleTableChange = async (pag, _, __) => {
  const { current, pageSize, total } = pag;
  queryParams.page = current;
  queryParams.limit = pageSize;
//   tableData.total = total;
  emit("fetchData", queryParams)
};
</script>
