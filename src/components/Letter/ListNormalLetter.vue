<template>
  <div class="flex flex-wrap gap-4 my-2">
    <!-- <a-input
        placeholder="Tìm kiếm"
        class="w-[200px]"
        v-model:value="queryParams.s"
      ></a-input> -->
    <!-- <a-range-picker v-model:value="filterDate" :locale="locale" /> -->
    <!-- <a-button @click="search" type="primary">Tìm kiếm</a-button> -->
    <a-button @click="showSendAllLetter = true" type="primary">{{
      $t("Letter.sendAll")
    }}</a-button>
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
        <template v-if="column.key === 'conditional'">
          <div v-if="record.user">{{ record.user.username }}</div>
          <div v-else>{{ $t("Letter.allUser") }}</div>
        </template>
      </template>
    </a-table>
  </div>
  <SendAll
    v-if="showSendAllLetter"
    @close="showSendAllLetter = false"
    @updated="onUpdated"
  />
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import SendAll from "@/components/Letter/SendAll.vue";
import { SendOutlined } from "@ant-design/icons-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const columns = [
  {
    title: $t("Letter.userName"),
    key: "conditional",
  },
  {
    title: $t("Letter.caption"),
    dataIndex: "title",
  },
  {
    title: $t("Letter.content"),
    dataIndex: "content",
  },
];

const showSendAllLetter = ref(false);

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

const getListNormalLetter = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.LETTER_NORMALLIST, {
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
  //   getListNormalLetter();
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
  getListNormalLetter();
};

function onUpdated() {
  getListNormalLetter();
  showSendAllLetter.value = false;
}

getListNormalLetter();
</script>
