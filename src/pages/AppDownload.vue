<template>
  <a-button type="primary" @click="isShowAddModal = true">
    {{ $t("app_download.add_btn") }}</a-button
  >
  <div class="flex flex-wrap gap-4 my-2">
    <a-input
      :placeholder="$t('app_download.name')"
      class="w-[200px]"
      v-model:value="queryParams.name"
    ></a-input>
    <!-- <a-range-picker v-model:value="filterDate" :locale="locale" /> -->
    <a-button @click="search" type="primary"> {{ $t("search") }} </a-button>
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
        <template v-if="column.key === 'link'">
          <a-typography-link :href="record.link" target="_blank"> {{ record.link }} </a-typography-link>
        </template>
        <template v-if="column.key === 'show'">
          <a-tag color="success" v-if="record.show">{{
            $t("app_download.show")
          }}</a-tag>
          <a-tag v-else>{{ $t("app_download.hide") }}</a-tag>
        </template>

        <template v-if="column.key === 'action'">
          <AppDownloadAction
            :data="record"
            @updated="(e) => onUpdated(record, e)"
          />
        </template>
      </template>
    </a-table>
  </div>

  <AddAppDownloadModal
    v-if="isShowAddModal"
    @close="isShowAddModal = false"
  />
</template>
  <script setup>
import { reactive, computed, ref } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import {} from "@ant-design/icons-vue";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import AppDownloadAction from "@/components/AppDownload/AppDownloadAction.vue";
import AddAppDownloadModal from "@/components/AppDownload/AddAppDownloadModal.vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const columns = [
  {
    title: "STT",
    dataIndex: "stt",
  },
  {
    title: $t("app_download.name"),
    dataIndex: "name",
  },

  {
    title: $t("app_download.link"),
    key: "link",
  },

  {
    title: $t("app_download.show"),
    key: "show",
  },

  {
    title: $t("action"),
    key: "action",
  },
];

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
  name: null,
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

const isShowAddModal = ref(false);

const getData = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.APP_DOWNLOAD, {
      params: queryParams,
    });
    if (res.ok) {
      const { total, data } = res.d;
      tableData.data = data.map((e, index) => {
        const { current, pageSize } = pagination.value;
        return {
          ...e,
          stt: (current - 1) * pageSize + index + 1,
        };
      });
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
  getData();
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

function onUpdated(record, payload) {
  getData();
}

getData();
</script>
