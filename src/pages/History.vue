<script setup>
import { reactive, computed, ref, defineProps, defineExpose } from "vue";
import request from "@/request";
import api from "@/request/api";
import { LeftOutlined } from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps({
  data: Object,
});
const emit = defineEmits(["close"]);

const columns = [
  {
    title: $t("LoginHistory.des"),
    dataIndex: "description",
  },
  {
    title: $t("LoginHistory.surplus"),
    dataIndex: "balance",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("LoginHistory.trans"),
    dataIndex: "red",
    // customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("time"),
    dataIndex: "date",
    customRender: ({ text }) => formatDateTime(text),
  },
];

const filterDate = ref([dayjs().startOf("days"), dayjs()]);

const queryParams = reactive({
  page: 1,
  kmess: 10,
  nickname: props.data.name,
  from: new Date(
    filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  ).toISOString(),
  to: new Date(filterDate.value[1].format("YYYY-MM-DD 23:59:59")).toISOString(),
});

const tableData = reactive({
  data: [],
  loading: false,
  total: 0,
});

const pagination = computed(() => ({
  total: tableData.total,
  showSizeChanger: false,
  current: queryParams.page,
  pageSize: queryParams.kmess,
}));

const getHistory = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.USER_HISTORY, { params: queryParams });
    if (res.status) {
      const { kmess, page, total, history } = res.data;
      tableData.data = history;
      tableData.total = total;
      queryParams.page = page;
      queryParams.kmess = kmess;
    }
  } catch (error) {
    console.log(error);
  } finally {
    tableData.loading = false;
  }
};

const handleTableChange = async (pag, _, __) => {
  const { current, pageSize, total } = pag;
  queryParams.page = current;
  queryParams.kmess = pageSize;
  tableData.total = total;
  getHistory();
};

const search = () => {
  if (filterDate.value) {
    queryParams.from = new Date(
      filterDate.value[0].format("YYYY-MM-DD 00:00:00")
    ).toISOString();
    queryParams.to = new Date(
      filterDate.value[1].format("YYYY-MM-DD 23:59:59")
    ).toISOString();
  } else {
    queryParams.from = null;
    queryParams.to = null;
  }
  queryParams.page = 1;
  getHistory();
};

getHistory();
</script>

<template>
  <div
    class="inline my-2 cursor-pointer hover:opacity-50"
    @click="emit('close')"
  >
    <LeftOutlined />{{ $t("back") }}
  </div>
  <h3 class="mt-2">
    {{ $t("LoginHistory.historyUserPlay") }}: {{ props.data.name }}
  </h3>
  <div class="my-2 flex flex-wrap gap-4">
    <a-range-picker v-model:value="filterDate" :locale="locale" />
    <a-button @click="search" class="mx-2" type="primary">{{
      $t("search")
    }}</a-button>
  </div>
  <a-table
    :columns="columns"
    :data-source="tableData.data"
    :pagination="pagination"
    :loading="tableData.loading"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'red'">
        <span
          :class="{
            'text-red-500': record.transType == 'minus',
            'text-green-500': record.transType != 'minus',
          }"
          >{{ record.transType == "minus" ? "-" : "+"
          }}{{ formatNumber(record.red) }}</span
        >
      </template>
    </template>
  </a-table>
</template>
