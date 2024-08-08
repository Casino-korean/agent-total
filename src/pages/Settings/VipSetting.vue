<template>
  <a-button type="primary" @click="showAddVipModal = true, isAddVipModal = true">Thêm</a-button>
  <div class="overflow-y-auto pt-2">
    <a-table
      :columns="columns"
      :data-source="tableData.data"
      :pagination="pagination"
      :loading="tableData.loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
           <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="history" @click="editVip(record)">
                  <EditOutlined />
                  {{ $t("edit") }}
                </a-menu-item>
              </a-menu>
            </template>
            <a-button type="primary" size="">
              <MoreOutlined />
            </a-button>
          </a-dropdown>
        </template>
<!--        <template v-if="column.dataIndex === 'totalCommission'">-->
<!--          <span style="color: green" > + {{formatNumber(record.totalCommission)}}</span>-->
<!--        </template>-->
<!--        <template v-if="column.dataIndex === 'totalBetLoss'">-->
<!--          <span style="color: red" > - {{formatNumber(record.totalBetLoss)}}</span>-->
<!--        </template>-->
<!--        <template v-if="column.dataIndex === 'totalBetWin'">-->
<!--          <span style="color: green" > {{formatNumber(record.totalBetWin)}}</span>-->
<!--        </template>-->
      </template>
    </a-table>
  </div>
  <AddOrEditVipModal
    v-if="showAddVipModal"
    @close="showAddVipModal = false"
    :data="currentVip"
    :is-add="isAddVipModal"
    @updated="onUpdated"
  />
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber } from "@/helpers/format";

import { useI18n } from "vue-i18n";
import AddOrEditVipModal from "@components/Settings/AddOrEditVipModal.vue";
import {EditOutlined, HistoryOutlined, MessageOutlined, MoreOutlined} from "@ant-design/icons-vue";
const { t: $t } = useI18n({ useScope: "global" });
// const optionUserType = [
//     { value: 'user', label: $t("user") },
//     { value: 'agent', label: $t("agent") },
// ];
const showAddVipModal = ref(false)
const isAddVipModal = ref(true)
const currentVip = ref({})
const columns = [
  // },
  {
    title: $t("User.vip"),
    dataIndex: "level"
  },
  {
    title: $t("User.totalBet"),
    dataIndex: "moneyBet",
    customRender: ({ text }) => formatNumber(text),
  },
  {
    title: $t("User.members"),
    dataIndex: "totalMem",
  },
  {
    title: $t("Transaction.rateVip"),
    dataIndex: "rate",

  },
    {
    title: $t("User.rewardVip"),
    dataIndex: "rewardVip",
    customRender: ({ text }) => formatNumber(text),
  },
  {
    title: $t("User.rewardBirthday"),
    dataIndex: "rewardBirthday",
    customRender: ({ text }) => formatNumber(text),
  },
  {
    title: $t("action"),
    key: "action",
    fixed: "right",
    width: 70,
  },
];

const queryParams = reactive({
  page: 1,
  limit: 10
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

const getVipList = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.SETTING_VIP, {
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
  await getVipList();
};

const editVip = (current) => {
  currentVip.value = current;
  isAddVipModal.value = false;
  showAddVipModal.value = true;
}

const onUpdated = () => {
  showAddVipModal.value = false;
  getVipList();
}

getVipList();
</script>
