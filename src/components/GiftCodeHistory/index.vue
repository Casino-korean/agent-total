<template>
   <div class="flex flex-wrap justify-center">
      <div style="background: #ececec; padding: 10px">
        <a-card class="text-center" title="Số lượng đã duyệt" :bordered="false" style="width: 350px">
          <p class="text-2xl font-bold" :style="{color: 'green'}">
            {{ formatNumber(totalSuccess) }}
          </p>
        </a-card>
      </div>
        <div style="background: #ececec; padding: 10px">
        <a-card class="text-center" :title="$t('Số tiền đã duyệt')" :bordered="false" style="width: 350px">
          <p class="text-2xl font-bold" :style="{color: 'green'}">
            {{ formatNumber(totalAmountSuccess) }}
          </p>
        </a-card>
      </div>
        <div style="background: #ececec; padding: 10px">
        <a-card class="text-center" :title="$t('Số lượng chờ duyệt')" :bordered="false" style="width: 350px">
          <p class="text-2xl font-bold" :style="{color: 'orange'}">
            {{ formatNumber(totalPending) }}
          </p>
        </a-card>
      </div>
    <div style="background: #ececec; padding: 10px">
        <a-card class="text-center" :title="$t('Số tiền chờ duyệt')" :bordered="false" style="width: 350px">
          <p class="text-2xl font-bold" :style="{color: 'orange'}">
            {{ formatNumber(totalAmountPending) }}
          </p>
        </a-card>
      </div>
    </div>
  <div class="flex flex-wrap gap-4 my-2">
    <a-input
      :placeholder="$t('searchByUsername')"
      class="w-[200px]"
      v-model:value="queryParams.s"
    ></a-input>
<!--    <a-select-->
<!--       :placeholder="$t('Transaction.typeMoney')"-->
<!--      :options="optionMoney"-->
<!--      class="w-[200px]"-->
<!--      v-model:value="queryParams.typeMoney"-->
<!--    ></a-select>-->
<!--     <a-select-->
<!--      :placeholder="$t('Transaction.status')"-->
<!--      :options="optionStatus"-->
<!--      class="w-[200px]"-->
<!--      v-model:value="queryParams.status"-->
<!--    ></a-select>-->
    <a-range-picker v-model:value="filterDate" :locale="locale" />
    <a-select
      :options="dateOptions"
      v-model:value="dateSelect"
      @change="onChangeSelectDate"
    ></a-select>
    <a-select
      :placeholder="$t('Transaction.status')"
      :options="optionStatus"
      class="w-[200px]"
      v-model:value="queryParams.status"
    ></a-select>
<!--    <a-select-->
<!--       :placeholder="$t('Transaction.userType')"-->
<!--      :options="optionUserType"-->
<!--      class="w-[200px]"-->
<!--      v-model:value="queryParams.typeUser"-->
<!--    ></a-select>-->
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
<!--        <template v-if="column.key === 'stt'">-->
<!--          <span> {{index + 1 + (pagination.current-1)*pagination.pageSize}}</span>-->
<!--        </template>-->
<!--        <template v-if="column.key === 'bank'">-->
<!--          <div>-->
<!--            {{ $t("bank") }} :-->
<!--            <b>{{ record.bankName }}</b>-->
<!--          </div>-->
<!--          <div>-->
<!--            {{ $t("acountNumber") }} :-->
<!--            <b>{{ record.accountNumber }}</b>-->
<!--          </div>-->
<!--          <div>-->
<!--            {{ $t("useBank") }} :-->
<!--            <b>{{ record.accountName }}</b>-->
<!--          </div>-->
<!--          <div>-->
<!--            {{ $t("Letter.content") }} :-->
<!--            <b>{{ record.content }}</b>-->
<!--          </div>-->
<!--        </template>-->
        <template v-if="column.key === 'status'">
          <a-badge
            :count="statusText(record.status)"
            :number-style="{ backgroundColor: statusColor(record.status) }"
          />
        </template>
          <template v-if="column.key === 'amount'">
         <span> {{formatNumber(record.user?.money)}}</span>
        </template>
        <template v-if="column.dataIndex === 'money'">
         <span style="color: green"> {{formatNumber(record.money)}}</span>
        </template>
        <template v-if="column.key === 'gift_code'">
         <span> {{record.gift_code?.code}}</span>
        </template>
        <template v-if="column.key === 'action'">
          <GiftCodeAction
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

import { useI18n } from "vue-i18n";
import GiftCodeAction from "@components/GiftCodeHistory/GiftCodeAction.vue";
const { t: $t } = useI18n({ useScope: "global" });

const columns = [
  //  {
  //   title: "STT",
  //   key: "stt"
  // },
  {
    title: $t("User.title"),
    dataIndex: "user",
    customRender: ({ text: user }) => user?.username,
  },
  {
    title: $t("User.nickName"),
    dataIndex: "user",
    customRender: ({ text: user }) => user?.displayName,
  },
  {
    title: $t("User.wallet"),
    key: "amount"
  },

  {
    title: $t("Giftcode.code"),
    dataIndex: "code",
  },

  {
    title: $t("Giftcode.amountOfMoney"),
    dataIndex: "money",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("Bank.status"),
    key: "status",
  },
  //
  // {
  //   title: $t("Partner.address"),
  //   key: "bank",
  // },
  //
  // {
  //   title: $t("Transaction.note"),
  //   dataIndex: "note",
  // },
  {
    title: $t("createDate"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },

  {
    title: $t("action"),
    key: "action",
    fixed: "right",
    width: 70,
  },
];

const showReport = ref(false);
const userSelected = ref(null);
const totalAmountPending = ref(0);
const totalPending = ref(0);
const totalSuccess = ref(0);
const totalAmountSuccess = ref(0);

const filterDate = ref([dayjs().startOf("days"), dayjs()]);

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
const dateSelect = ref(dateOptions[0].value);

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
  s: null,
  status: null,
  // typeMoney: null,
  // typeUser: null
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

const getHistoryUseGift = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.GIFTCODE_HISTORY,{
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

const getGiftcodeTotal = async () => {
  try {
    totalPending.value = 0
    totalSuccess.value = 0
    totalAmountSuccess.value = 0
    totalAmountPending.value = 0
    tableData.loading = true;
    const res = await request.get(api.GIFTCODE_TOTAL, {
      params: queryParams,
    });
    if (res.ok) {
      totalPending.value  = res.d.totalGiftCodePending
      totalSuccess.value  = res.d.totalGiftCodeSuccess
      totalAmountSuccess.value  = res.d.totalMoneySuccess
      totalAmountPending.value  = res.d.totalMoneyPending
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
  await getHistoryUseGift();
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
  queryParams.s = null;
  getHistoryUseGift();
  getGiftcodeTotal();
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
  getHistoryUseGift();
  getGiftcodeTotal();
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
  getHistoryUseGift();
  getGiftcodeTotal();
}

getHistoryUseGift();
getGiftcodeTotal();
</script>
