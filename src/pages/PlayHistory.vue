<script setup>
import { reactive, computed, ref, defineProps } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";

import { useI18n } from "vue-i18n";
import {ArrowLeftOutlined} from "@ant-design/icons-vue";
const { t: $t } = useI18n({ useScope: "global" });

const filterDate = ref([dayjs().startOf("days"), dayjs()]);

const columns = [
  {
    title: $t("User.title"),
    key: "user",
  },
  {
    title: $t("User.nameGame"),
    dataIndex: "game",
  },

  {
    title: $t("User.result"),
    key: "isWin",
  },

  {
    title: $t("User.moneyBet"),
    dataIndex: "money",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("destroy"),
    dataIndex: "moneyGiveBack",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("User.winningAmount"),
    dataIndex: "moneyWin",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("User.doorSet"),
    dataIndex: "order",
  },

  {
    title: $t("User.sessionNumber"),
    dataIndex: "seq",
  },

  {
    title: $t("User.time"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },
];

const queryParams = reactive({
  page: 1,
  limit: 10,
  from: new Date(
    filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  ).toISOString(),
  to: new Date(filterDate.value[1].format("YYYY-MM-DD 23:59:59")).toISOString(),
  s: null,
  game: "a",
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

const getListHistoryPlay = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.USER_HISTORYPLAY, {
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
  getListHistoryPlay();
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
  getListHistoryPlay();
};

function statusText(isWin) {
  switch (isWin) {
    case 0:
      return $t("User.loss");
    case 1:
      return $t("User.win");
    default:
      return isWin;
  }
}

function statusColor(isWin) {
  switch (isWin) {
    case 0:
      return "#dc3545";
    case 1:
      return "#28a745";
    default:
      return "#6c757d";
  }
}

getListHistoryPlay();
</script>

<template>
  <div class="flex flex-wrap gap-4 my-2">
    <a-input
      :placeholder="$t('User.id')"
      class="w-[200px]"
      v-model:value="queryParams.id"
    ></a-input>
    <a-input
      :placeholder="$t('search')"
      class="w-[200px]"
      v-model:value="queryParams.s"
    ></a-input>
    <a-range-picker v-model:value="filterDate" :locale="locale" />
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
        <template v-if="column.key === 'user'">
          <p>{{ $t("User.id") }}: {{ record.user.seq }}</p>
          <p>{{ $t("User.userName") }}: {{ record.user.username }}</p>
          <p>{{ $t("User.nickName") }}: {{ record.user.displayName }}</p>
        </template>
        <template v-if="column.key === 'isWin'">
          <a-badge
            :count="statusText(record.isWin)"
            :number-style="{ backgroundColor: statusColor(record.isWin) }"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
