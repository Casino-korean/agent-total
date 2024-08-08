<template>
  <div class="flex flex-wrap gap-4 my-2">
    <a-input
      placeholder="ID"
      class="w-[200px]"
      v-model:value="queryParams.id"
    ></a-input>
    <a-input
      :placeholder="$t('userName')"
      class="w-[200px]"
      v-model:value="queryParams.s"
    ></a-input>
    <a-input
      placeholder="IP"
      class="w-[200px]"
      v-model:value="queryParams.ip"
    ></a-input>
    <!-- <a-range-picker v-model:value="filterDate" :locale="locale" /> -->
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
    </a-table>
  </div>
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import HistoryPlay from "@/components/Users/HistoryPlay.vue";
import ModalSendLetterPrivate from "@/components/Letter/ModalSendLetterPrivate.vue";
import EditUserModal from "@/components/Users/EditUserModal.vue";

import {
  MoreOutlined,
  HistoryOutlined,
  EditOutlined,
  MessageOutlined, ArrowLeftOutlined,
} from "@ant-design/icons-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const columns = [
  {
    title: "ID",
    dataIndex: "seq",
  },
  {
    title: $t("userName"),
    dataIndex: "user",
    customRender: ({ text: user }) => user.username,
  },
  {
    title: $t("LoginHistory.browser"),
    dataIndex: "browser",
  },

  {
    title: $t("LoginHistory.device"),
    dataIndex: "device",
  },

  {
    title: "OS",
    dataIndex: "os",
  },

  {
    title: "IP",
    dataIndex: "ip",
  },
  //   {
  //     title: "user-agent",
  //     dataIndex: "ua",
  //   },
  {
    title: $t("time"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },
];

const curtableData = ref({});
const showModalHistoryPlay = ref(false);
const onHistoryPlay = (value) => {
  curtableData.value = value;
  showModalHistoryPlay.value = true;
};

const showModalSendPrivateLetter = ref(false);
const onSendLetterPrivate = (value) => {
  curtableData.value = value;
  showModalSendPrivateLetter.value = true;
};

const showEditModal = ref(false);
const onEditUserClicked = (value) => {
  curtableData.value = value;
  showEditModal.value = true;
};

const filterDate = ref([dayjs().startOf("month"), dayjs()]);

const queryParams = reactive({
  page: 1,
  limit: 10,
  from: new Date(
    filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  ).toISOString(),
  to: new Date(filterDate.value[1].format("YYYY-MM-DD 23:59:59")).toISOString(),
  s: null,
  id: null,
  ip: null,
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

const getListUser = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.LOGIN_LOGS, { params: queryParams });
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
  getListUser();
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
  getListUser();
};

function onUpdated() {
  showModalSendPrivateLetter.value = false;
  getListUser();
}

getListUser();
</script>
