<template>
  <div class="flex flex-wrap gap-4 my-2">
    <!-- <a-input
      placeholder="Tìm kiếm"
      class="w-[200px]"
      v-model:value="queryParams.s"
    ></a-input> -->
    <!-- <a-range-picker v-model:value="filterDate" :locale="locale" /> -->
    <!-- <a-button @click="search" type="primary">Tìm kiếm</a-button> -->
    <a-button @click="showCreateIp = true" type="primary">{{$t('addWhiteList')}}</a-button>
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
        <template v-if="column.key === 'action'">
          <SettingsIPActions
            :data="record"
            @updated="onUpdated"
          />
        </template>
      </template>
    </a-table>
  </div>
  <AddOrEditIp
    type="create"
    v-if="showCreateIp"
    @close="showCreateIp = false"
    @updated="onUpdated"
  />
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import UserAction from "@/components/Users/UserAction.vue";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import AddOrEditIp from "@/components/Settings/AddOrEditIp.vue";
import SettingsIPActions from "@/components/Settings/SettingsIPActions.vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const columns = [
  {
    title: $t('name'),
    dataIndex: "name",
  },
  {
    title: "IP",
    dataIndex: "ip",
  },

  {
    title: $t('createDate'),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },

  {
    title: $t('action'),
    key: "action",
  },
];

const showReport = ref(false);
const userSelected = ref(null);
const showCreateIp = ref(false);

const filterDate = ref([dayjs().startOf("month"), dayjs()]);

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

const getListIP = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.SETINGS_IP_ALLOW_LIST, {
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
  //   getListIP();
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
  getListIP();
};

function onUpdated(record, payload) {
  getListIP();
  showCreateIp.value = false;
}

getListIP();
</script>
