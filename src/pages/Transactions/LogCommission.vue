<template>
  <div class="flex flex-wrap gap-4 my-2">
    <a-input
      :placeholder="$t('searchByUsername')"
      class="w-[200px]"
      v-model:value="queryParams.toUsername"
    ></a-input>
    <a-select
       :placeholder="$t('Transaction.userType')"
      :options="optionUserType"
      class="w-[200px]"
      v-model:value="queryParams.typeUser"
    ></a-select>
    <a-range-picker v-model:value="filterDate" :locale="locale" />
    <a-select
      :options="dateOptions"
      v-model:value="dateSelect"
      @change="onChangeSelectDate"
    ></a-select>
    <a-button @click="search" type="primary">{{ $t("search") }}</a-button>
    <a-button @click="$router.go(-1)" class="ml-3"><ArrowLeftOutlined></ArrowLeftOutlined></a-button>
  </div>
  <div class="overflow-y-auto">
    <a-table
      :columns="columns"
      :data-source="tableData.data"
      :pagination="pagination"
      :loading="tableData.loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'totalCommission'">
          <span style="color: green" > + {{formatNumber(record.totalCommission)}}</span>
        </template>
        <template v-if="column.dataIndex === 'totalBetLoss'">
          <span style="color: red" > - {{formatNumber(record.totalBetLoss)}}</span>
        </template>
        <template v-if="column.dataIndex === 'totalBetWin'">
          <span style="color: green" > {{formatNumber(record.totalBetWin)}}</span>
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
import {ArrowLeftOutlined} from "@ant-design/icons-vue";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import TransactionAction from "@/components/Transactions/TransactionAction.vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });
const optionUserType = [
    { value: 'user', label: $t("user") },
    { value: 'agent', label: $t("agent") },
];
const columns = [
  // },
  {
    title: $t("User.title"),
    dataIndex: "toUsername"
  },
  {
    title: $t("Transaction.userType"),
    dataIndex: "typeUser",
    customRender: ({ text }) => text === 'agent' ? $t("agent") : $t("user"),
  },
  {
    title: $t("Transaction.userOfAgent"),
    dataIndex: "fromUsername",
  },
    {
    title: $t("Transaction.commission"),
    dataIndex: "totalCommission",
    customRender: ({ text }) => formatNumber(text),

  },
    {
    title: $t("Transaction.betUserOfAgent"),
    dataIndex: "totalBet",
    customRender: ({ text }) => formatNumber(text),
  },
    {
    title: $t("Transaction.betWinUserOfAgent"),
    dataIndex: "totalBetWin",
    customRender: ({ text }) => formatNumber(text),
  },
    {
    title: $t("Transaction.betLossUserOfAgent"),
    dataIndex: "totalBetLoss",
    customRender: ({ text }) => formatNumber(text),
  },
  {
    title: $t("Transaction.rateVip"),
    dataIndex: "rate_vip",
    customRender: ({ text }) => formatNumber(text),
  },
  {
    title: $t("createDate"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  }
];

const filterDate = ref([dayjs().startOf("month"), dayjs()]);

const dateOptions = [
  {
    value: "today",
    label: $t("today"),
    startDate: () => dayjs().startOf("day"),
  },
  {
    value: "thisWeek",
    label: $t("thisWeek"),
    startDate: () => dayjs().startOf("week"),
  },
  {
    value: "thisMonth",
    label: $t("thisMonth"),
    startDate: () => dayjs().startOf("month"),
  },

  {
    value: "1",
    label: $t("all"),
    startDate: () => "",
  },
];

const onChangeSelectDate = (value, option) => {
  filterDate.value[0] = option.startDate();
}

const dateSelect = ref(dateOptions[2].value);

const queryParams = reactive({
  page: 1,
  limit: 10,
  from: new Date(
    filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  ).toISOString(),
  to: new Date(filterDate.value[1].format("YYYY-MM-DD 23:59:59")).toISOString(),
  username: null,
  typeUser: null
});

const tableData = reactive({
  data: [],
  loading: false,
  total: 0,
});

const pagination = computed(() => ({
  total: tableData.total,
  current: queryParams.page,
  pageSize: queryParams.limit,
}));

const getTransactionList = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.TRANSACTIONS_COMMISSION, {
      params: queryParams,
    });
    if (res.ok) {
      const { total, data } = res.d;
      tableData.data = data;
      tableData.total = total;
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
  queryParams.limit = pageSize;
  tableData.total = total;
  await getTransactionList();
};


const search = () => {
  if (filterDate.value) {
    queryParams.from = new Date(
      filterDate.value[0].format("YYYY-MM-DD 00:00:00")
    ).toISOString();
    queryParams.to = new Date(
      filterDate.value[1].format("YYYY-MM-DD 23:59:59")
    ).toISOString();
  }
  queryParams.page = 1;
  getTransactionList();
};

getTransactionList();
</script>
