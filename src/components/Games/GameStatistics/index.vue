<template>
  <div class="flex flex-wrap gap-2 my-2">
    <a-input
      :placeholder="$t('User.accountName')"
      class="w-[200px]"
      v-model:value="queryParams.s"
    ></a-input>
    <a-select
       :placeholder="$t('User.nameGame')"
      :options="gameOptions"
      class="w-[200px]"
      v-model:value="queryParams.game"
    ></a-select>
    <a-select
       :placeholder="$t('Transaction.userType')"
      :options="userTypeOptions"
      class="w-[200px]"
      v-model:value="queryParams.typeUser"
    ></a-select>
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

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import api from "@/request/api";
import request from "@/request";
import { formatNumber, formatDateTime } from "@/helpers/format";
import {ArrowLeftOutlined} from "@ant-design/icons-vue";

const { t: $t } = useI18n({ useScope: "global" });

const filterDate = ref([dayjs().startOf("month"), dayjs()]);
const queryParams = reactive({
  page: 1,
  limit: 10,
  from: new Date(
    filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  ).toISOString(),
  to: new Date(filterDate.value[1].format("YYYY-MM-DD 23:59:59")).toISOString(),
  game: null,
  s: null,
  typeUser: null
});
const filterUserRole = ref()
const filterUserName = ref()

const search = async () => {
  if (filterDate.value) {
    queryParams.from = new Date(
      filterDate.value[0].format("YYYY-MM-DD 00:00:00")
    ).toISOString();
    queryParams.to = new Date(
      filterDate.value[1].format("YYYY-MM-DD 23:59:59")
    ).toISOString();
  }
  queryParams.page = 1;
  await getListHistoryPlay();
};

const gameOptions = [
    { value: null, label: $t("all")},
    { value: 'baccarat', label: "Baccarat" },
    { value: 'bau_cua', label: "Bầu cua" },
    { value: 'tiger_dragon', label: "Rồng hổ" },
    { value: 'tai_xiu', label: "Tài xỉu thường" },
    { value: 'tai_xiu_md5', label: "Tài xỉu md5" },
    { value: 'slot_money', label: "Slot money" },
    { value: 'xoc_dia', label: "Xóc đĩa" },
    { value: 'xo_so_nhanh', label: "Xổ số nhanh" },
];
const userTypeOptions = [
    { value: null, label: $t("all")},
    { value: 'user', label: $t("user") },
    { value: 'agent', label: $t("agent") },
];

const columns = [
  {
    title: "Số seri",
    dataIndex: "seq",
  },
  {
    title: "Tên trò chơi",
    dataIndex: "game",
    customRender: ({ text }) => gameOptions.find((ele) => ele.value === text).label,
  },

  {
    title: "Tên tài khoản",
    dataIndex: "user",
    customRender: ({ text }) => text.username,
  },

  {
    title: "Loại khách hàng",
    dataIndex: "user",
    customRender: ({ text }) => userTypeOptions.find((ele) => ele.value === text.role).label,
  },

  // {
  //   title: "Cong ca cuoc",
  //   dataIndex: "",
  // },

  {
    title: "Số tiền đặt cược",
    dataIndex: "money",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: "Thắng/thua",
    key: "isWin",
  },

  {
    title: "Thời gian cá cược",
    dataIndex: "updatedAt",
    customRender: ({ text }) => formatDateTime(text),
  },
];

const tableData = reactive({
  data: [],
  loading: false,
  total: 0,
});

const pagination = computed(() => ({
  total: tableData.total,
  showSizeChanger: false,
  current: queryParams.page,
  pageSize: queryParams.limit,
}));

const handleTableChange = async (pag, _, __) => {
  const { current, pageSize, total } = pag;
  queryParams.page = current;
  queryParams.limit = pageSize;
  tableData.total = total;
  await getListHistoryPlay()
};

const getListHistoryPlay = async () =>{
    try{
      tableData.loading = true
      const res = await request.get(api.USER_HISTORYPLAY, {
        params: queryParams,
      });
      if (res.ok) {
        tableData.total = res.d.total;
        tableData.data = res.d.data;
      }
  } catch (error) {
    console.log(error);
  } finally {
    tableData.loading = false;
  }
}
const statusText = (isWin) => {
  switch (isWin) {
    case 0:
      return $t("User.loss");
    case 1:
      return $t("User.win");
    default:
      return isWin;
  }
}

const statusColor = (isWin) => {
  switch (isWin) {
    case 0:
      return "#dc3545";
    case 1:
      return "#28a745";
    default:
      return "#6c757d";
  }
}

onMounted(async()=>{
  await getListHistoryPlay();
})

</script>

<style lang="">
</style>
