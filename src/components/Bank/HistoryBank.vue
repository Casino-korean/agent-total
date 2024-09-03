<template>
  <div class="flex flex-wrap gap-4 my-2">
    <a-input
      :placeholder="$t('search')"
      class="w-[200px]"
      v-model:value="queryParams.s"
    ></a-input>
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
        <template v-if="column.key === 'fromUser'">
          <div>
            {{ $t("Bank.nameFigure") }} :
            <b>{{ record.fromUser?.name }}</b>
          </div>
          <div>
            {{ $t("Bank.nameUser") }} :
            <b>{{ record.fromUser?.name }}</b>
          </div>
        </template>

        <template v-if="column.key === 'toAgent'">
          <div>
            {{ $t("Bank.nameFigure") }} :
            <b>{{ record.toAgent?.name }}</b>
          </div>
          <div>
            {{ $t("Bank.nameUser") }} :
            <b>{{ record.toAgent?.name }}</b>
          </div>
        </template>

        <template v-if="column.key === 'action'">
          <a-dropdown>
            <!-- <template #overlay>
                  <a-menu @click="(e) => handleClickMenu(e, record)">
                    <a-menu-item key="edit">
                      <EditOutlined />
                      Chỉnh sửa
                    </a-menu-item>
                  </a-menu>
                </template> -->
            <a-button type="primary" size="">
              <MoreOutlined />
            </a-button>
          </a-dropdown>
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
import dayjs from "dayjs";
import {ArrowLeftOutlined, MoreOutlined} from "@ant-design/icons-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const columns = [
  {
    title: $t("Bank.recipients"),
    dataIndex: "fromInfo",
    customRender: ({ text }) => (text === "user" ? $t("Bank.player") : ""),
  },

  {
    title: $t("Bank.transferPlace"),
    dataIndex: "toInfo",
    customRender: ({ text }) => (text === "agent" ? $t("Partner.title") : ""),
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
    title: $t("Bank.datePay"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },

  {
    title: $t("Bank.namePlayer"),
    key: "fromUser",
  },

  {
    title: $t("Bank.nameAgent"),
    key: "toAgent",
  },

  {
    title: $t("action"),
    key: "action",
  },
];

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

const getListPay = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.ADMIN_HISTORYPAY, {
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
  getListPay();
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
  getListPay();
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

getListPay();
</script>
