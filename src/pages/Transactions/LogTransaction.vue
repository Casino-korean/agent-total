<template>
  <div class="flex flex-wrap gap-4 my-2">
    <a-input
      :placeholder="$t('searchByUsername')"
      class="w-[200px]"
      v-model:value="queryParams.username"
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
        <template v-if="column.key === 'status'">
          <a-badge
            :count="statusText(record.status)"
            :number-style="{ backgroundColor: statusColor(record.status) }"
          />
        </template>

        <template v-if="column.dataIndex === 'amount'">
          <span :style="{color: getColor(record.type)}" > {{formatNumber(record.amount)}}</span>
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
    dataIndex: "user",
    customRender: ({ text: user }) => user.username,
  },
  {
    title: $t("User.nickName"),
    dataIndex: "user",
    customRender: ({ text: user }) => user.displayName,
  },
  {
    title: $t("User.phone"),
    dataIndex: "user",
    customRender: ({ text: user }) => user.phone,
  },

  {
    title: $t("LoginHistory.surplus"),
    dataIndex: "balance",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("Giftcode.amountOfMoney"),
    dataIndex: "amount",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("Bank.status"),
    key: "status",
  },
  {
    title: $t("createDate"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },
  {
    title: $t("User.source"),
    dataIndex: "source",
    customRender: ({ text }) => genNameSource(text),
  },
];

const onChangeSelectDate = (value, option) => {
  filterDate.value[0] = option.startDate();
}

const filterDate = ref([dayjs().startOf("days"), dayjs()]);

const getColor = (type) => {
  if (type === 'withdraw') return 'red'
  return 'green'
}

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

const dateSelect = ref(dateOptions[0].value);

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

const genNameSource = (sc) => {
  if (sc === 'giftcode') return "Mã quà tặng"
  else if (sc === "admin") return "ADMIN"
  else if (sc === "deposit") return "Tiền nạp"
  else if (sc === "withdraw") return "Tiền rút"
  return sc
}

const getTransactionList = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.TRANSACTIONS_LIST + '/all', {
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

const onCloseHistory = () => {
  showHistory.value = false;
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

function statusText(status) {
  switch (status) {
    case 0:
      return $t("Bank.pending");
    case 1:
      return $t("Bank.success");
    case 2:
      return $t("Bank.loss");
    default:
      return status;
  }
}

function statusColor(status) {
  switch (status) {
    case 0:
      return "#ffc107";
    case 1:
      return "#28a745";
    case 2:
      return "#dc3545";
    default:
      return "#6c757d";
  }
}

function onUpdated(record, payload) {
  getTransactionList();
}

getTransactionList();
</script>
