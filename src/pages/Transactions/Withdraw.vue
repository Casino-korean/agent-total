<template>
  <div class="flex flex-wrap justify-center">
      <div style="background: #ececec; padding: 10px">
        <a-card class="text-center" title="Tổng rút thành công" :bordered="false" style="width: 350px">
          <p class="text-2xl font-bold" :style="{color: 'green'}">
            {{ formatNumber(totalAmountSuccess) }}
          </p>
        </a-card>
      </div>
        <div style="background: #ececec; padding: 10px">
        <a-card class="text-center" :title="$t('Tổng rút chờ duyệt')" :bordered="false" style="width: 350px">
          <p class="text-2xl font-bold" :style="{color: 'orange'}">
            {{ formatNumber(totalAmountPending) }}
          </p>
        </a-card>
      </div>
        <div style="background: #ececec; padding: 10px">
        <a-card class="text-center" :title="$t('Tổng rút thất bại')" :bordered="false" style="width: 350px">
          <p class="text-2xl font-bold" :style="{color: 'red'}">
            {{ formatNumber(totalAmountCancel) }}
          </p>
        </a-card></div>
    </div>
  <div class="flex flex-wrap gap-4 my-2">
    <a-input
      :placeholder="$t('searchByUsername')"
      class="w-[200px]"
      v-model:value="queryParams.username"
    ></a-input>
    <a-select
       :placeholder="$t('Transaction.typeMoney')"
      :options="optionMoney"
      class="w-[200px]"
      v-model:value="queryParams.typeMoney"
    ></a-select>
     <a-select
      :placeholder="$t('Transaction.status')"
      :options="optionStatus"
      class="w-[200px]"
      v-model:value="queryParams.status"
    ></a-select>
    <a-range-picker v-model:value="filterDate" :locale="locale" />
    <a-select
      :options="dateOptions"
      v-model:value="dateSelect"
      @change="onChangeSelectDate"
    ></a-select>
    <a-select
       :placeholder="$t('Transaction.userType')"
      :options="optionUserType"
      class="w-[200px]"
      v-model:value="queryParams.typeUser"
    ></a-select>
    <a-button @click="search" type="primary"> {{ $t("search") }} </a-button>
    <a-button @click="reload" class="ml-3"><ReloadOutlined></ReloadOutlined></a-button>
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
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'stt'">
          <span> {{index + 1 + (pagination.current-1)*pagination.pageSize}}</span>
        </template>
        <template v-if="column.key === 'bank'">
          <div>
            {{ $t("bank") }} :
            <b>{{ record.bankName }}</b>
          </div>
          <div>
            {{ $t("acountNumber") }} :
            <b>{{ record.accountNumber }}</b>
          </div>
          <div>
            {{ $t("useBank") }} :
            <b>{{ record.accountName }}</b>
          </div>
          <div>
            {{ $t("Letter.content") }} :
            <b>{{ record.content }}</b>
          </div>
        </template>
        <template v-if="column.key === 'status'">
          <a-badge
            :count="statusText(record.status)"
            :number-style="{ backgroundColor: statusColor(record.status) }"
          />
        </template>
        <template v-if="column.key === 'action'">
          <TransactionAction
            :data="record"
            @updated="(e) => onUpdated(record, e)"
          />
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
import {ArrowLeftOutlined, ReloadOutlined} from "@ant-design/icons-vue";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import TransactionAction from "@/components/Transactions/TransactionAction.vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const columns = [
  //  {
  //   title: "STT",
  //   key: "stt"
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
    title: $t("Transaction.typeMoney"),
    dataIndex: "typeMoney",
    customRender: ({ text }) => text?.toUpperCase(),
  },
  {
    title: $t("Bank.status"),
    key: "status",
  },

  {
    title: $t("Partner.address"),
    key: "bank",
  },

  {
    title: $t("Transaction.note"),
    dataIndex: "note",
  },
  {
    title: $t("createDate"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },
  //
  {
    title: $t("action"),
    key: "action",
    fixed: "right",
    width: 70,
  },
];

const showReport = ref(false);
const userSelected = ref(null);
const totalAmountSuccess = ref(0)
const totalAmountPending = ref(0)
const totalAmountCancel = ref(0)

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
const optionStatus = [
    { value: 1, label: $t("success") },
    { value: 2, label: $t("lose") },
    { value: 0, label: $t("pending") },
    { value: null, label: $t("all") }
];

const optionMoney = [
    { value: 'vnd', label: $t("vnd") },
    { value: 'usdt', label: $t("usdt") },
];

const optionUserType = [
    { value: 'user', label: $t("user") },
    { value: 'agent', label: $t("agent") },
];
const dateSelect = ref(dateOptions[2].value);

function onChangeSelectDate(value, option) {
  filterDate.value[0] = option.startDate();
}

const queryParams = reactive({
  page: 1,
  limit: 10,
  from: new Date(
    filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  ).toISOString(),
  to: new Date(filterDate.value[1].format("YYYY-MM-DD 23:59:59")).toISOString(),
  username: null,
  status: null,
  typeMoney: null,
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
    const res = await request.get(api.TRANSACTIONS_LIST + "/withdraw", {
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

const getTransactionTotal = async () => {
  try {
    totalAmountCancel.value = 0
    totalAmountSuccess.value = 0
    totalAmountPending.value = 0
    tableData.loading = true;
    const res = await request.get(api.TRANSACTIONS_TOTAL + "/withdraw", {
      params: queryParams,
    });
    if (res.ok) {
      res.d.forEach((data) => {
        switch (data._id) {
          case 2:
            totalAmountCancel.value = data.total;
            break;
          case 1:
            totalAmountSuccess.value = data.total;
            break;
          case 0:
            totalAmountPending.value = data.total;
            break;
          default:
            break;
        }
      })
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

const reload = () => {
  filterDate.value = [dayjs().startOf("month"), dayjs()];
  dateSelect.value = dateOptions[2].value;
  queryParams.from = new Date(
    filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  ).toISOString();
  queryParams.to = new Date(
    filterDate.value[1].format("YYYY-MM-DD 23:59:59")
  ).toISOString();
  queryParams.username = null;
  queryParams.typeUser = null;
  queryParams.status = null;
  queryParams.typeMoney = null;
  getTransactionList();
  getTransactionTotal();
}

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
  getTransactionTotal();
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
  getTransactionTotal();
}

getTransactionList();
getTransactionTotal();
</script>
