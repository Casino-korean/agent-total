<template>
  <div class="my-2 flex flex-wrap gap-4">
    <a-button @click="createAgent" type="primary">
      <template #icon> <PlusOutlined /> </template>
    </a-button>
    <a-input
      :placeholder="$t('userName')"
      class="w-[200px]"
      v-model:value="queryParams.username"
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
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'username'">
                  <span :style="{ color: '#346597', fontWeight: 700 }">{{
                    record.username
                  }}</span>
                </template>
                <template v-if="column.dataIndex === 'displayName'">
                  <span :style="{ color: '#346597', fontWeight: 700 }">{{
                    record.displayName
                  }}</span>
                </template>
                <template v-if="column.dataIndex === 'commissionGame'">
                  <span :style="{ color: 'green', fontWeight: 700}">{{
                    formatNumber(record?.commissionGame ?? 0)
                  }}</span>
                </template>
                <template v-if="column.dataIndex === 'seq'">
                  <span :style="{ color: '#eca019', fontWeight: 700 }">{{
                      record.seq
                  }}</span>
                </template>

                <template v-if="column.dataIndex === 'phone'">
                  <span :style="{ color: '#a10ac7', fontWeight: 700 }">{{
                    record?.phone
                  }}</span>
                </template>

                <template v-if="column.dataIndex === 'money'">
                  <span :style="{ color: 'green', fontWeight: 700 }">{{
                    formatNumber(record?.money ?? 0)
                  }}</span>
                </template>
                <template v-if="column.dataIndex === 'withdrawSum'">
                  <span :style="{ color: '#b94a48', fontWeight: 700 }">{{
                    formatNumber(record?.withdrawSum ?? 0)
                  }}</span>
                </template>
                <template v-if="column.dataIndex === 'depositSum'">
                  <span :style="{ color: '#2a6395', fontWeight: 700 }">{{
                    formatNumber(record?.depositSum ?? 0)
                  }}</span>
                </template>

                <template v-if="column.dataIndex === 'orderSum'">
                  <span :style="{ color: '#820293', fontWeight: 700 }">{{
                    formatNumber(record?.orderSum ?? 0)
                  }}</span>
                </template>

                <template v-if="column.dataIndex === 'userSum'">
                  <span :style="{ color: '#b94a48', fontWeight: 700 }">{{
                    record?.userSum
                  }}</span>
               </template>

                 <template v-if="column.dataIndex === 'winLossSum'">
                  <span :style="{ color: record.winLossSum >= 0 ? 'green' : 'red' , fontWeight: 700 }">{{
                    formatNumber(record?.winLossSum ?? 0)
                  }}</span>
                </template>

                 <template v-if="column.dataIndex === 'vip'">
                  <span :style="{ color: 'red', fontWeight: 700 }">{{
                    record?.vip
                  }}</span>
                </template>

               <template v-if="column.key === 'parent'">
                  <span :style="{ color: 'blue', fontWeight: 700 }">{{
                    record?.agent?.username
                  }}</span>
                </template>

                <template v-if="column.dataIndex === 'level'">
                  <span class="label label-default"> Cấp {{
                    record.level
                  }}</span>
                </template>
                <template v-if="column.dataIndex === 'isDisabled'">
                    <a-tag color="success" v-if="!record.isDisabled">{{
                      genStatus(record.isDisabled)
                    }}</a-tag>
                    <a-tag color="red" v-else>{{ genStatus(record.isDisabled) }}</a-tag>
                  </template>
      <template v-if="column.key === 'action'">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="EditMdAgent(record)" key="1">
                <EditOutlined />
                {{ $t("edit") }}
              </a-menu-item>
              <a-menu-item @click="AgentTransfer(record)" key="2">
                <TransactionOutlined />
                {{ $t("Partner.agentPay") }}
              </a-menu-item>
            </a-menu>
          </template>
          <a-button type="primary" size="">
            <!-- Chi tiết -->
            <MoreOutlined />
          </a-button>
        </a-dropdown>
      </template>
    </template>
  </a-table>
  </div>
  <AddAgentModal
    v-if="showCreateModal"
    :agents = "listAgents"
    @close="showCreateModal = false"
    @updated="onCreatedAgent"
  />
  <EditAgent
    v-if="showEditModalAgent"
    @close="showEditModalAgent = false"
    @Edit="onEditAgent"
    :curtableData="curtableData"
    :agents = "listAgents"
  />
  <ModalAgentGlobalTransferMoney
    v-if="showModalAgentTransfer"
    @close="showModalAgentTransfer = false"
    @Edit="onAgentTransfer"
    :curtableData="curtableData"
  />
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import request from "@/request/index.js";
import api from "@/request/api.js";
import { formatNumber, formatDateTime } from "@/helpers/format.js";
import {
  MoreOutlined,
  EditOutlined,
  PlusOutlined,
  TransactionOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons-vue";
import { useUserStore } from "@/store/user";
import dayjs from "dayjs";
import EditAgent from "@components/Agent/EditAgent.vue";
import ModalAgentGlobalTransferMoney from "@components/Agent/ModalAgentGlobalTransferMoney.vue";

import { useI18n } from "vue-i18n";
import AddAgentModal from "@components/Agent/AddAgentModal.vue";
const { t: $t } = useI18n({ useScope: "global" });
const userStore = useUserStore();
const columns = [
  {
    title: $t("User.id"),
    dataIndex: "seq",
  },
  {
    title: $t("User.userName"),
    dataIndex: "username",
  },
  {
    title: $t("User.nickName"),
    dataIndex: "displayName",
  },
  {
    title: $t("User.parent"),
    key: "parent",
  },
   {
    title: $t("User.refernalCode"),
    dataIndex: "refCode",
  },
  {
    title: $t('Transaction.status'),
    dataIndex: "isDisabled",
    customRender: ({ text }) => genStatus(text),
  },
   {
    title: $t("User.userSum"),
    dataIndex: "userSum",
  },
  {
    title: $t("User.totalDeposit"),
    dataIndex: "depositSum",
    customRender: ({ text }) => formatNumber(text),
  },
  {
    title: $t("User.totalWidthdraw"),
    dataIndex: "withdrawSum",
    customRender: ({ text }) => formatNumber(text),
  },
  {
    title: $t("User.totalBet"),
    dataIndex: "orderSum",
    customRender: ({ text }) => formatNumber(text),
  },
  {
    title: $t("User.totalWinLoss"),
    dataIndex: "winLossSum",
    customRender: ({ text }) => formatNumber(text),
  },
  // {
  //   title: $t("User.gameRound"),
  //   dataIndex: "gameSum",
  //   customRender: ({ text }) => formatNumber(text),
  // },
  {
    title: $t("User.moneyFromGiftcode"),
    dataIndex: "giftcodeSum",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("User.commissionGame"),
    dataIndex: "commissionGame",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("User.accountCreateDate"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },

  {
    title: $t("User.action"),
    key: "action",
    fixed: "right",
    width: 70,
  },
];
console.log(userStore.$state.userInfo)
const curtableData = ref({});
const showCreateModal = ref(false);
const showEditModalAgent = ref(false);
const showModalAgentTransfer = ref(false);
const listAgents = ref([])
const users = userStore.getUserInfo()
const filterDate = ref([dayjs().startOf("month"), dayjs()]);

const queryParams = reactive({
  page: 1,
  limit: 10,
  // from: new Date(
  //   filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  // ).toISOString(),
  // to: new Date(filterDate.value[1].format("YYYY-MM-DD 23:59:59")).toISOString(),
  username: null,
  type: 'agent'
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
    const res = await request.get(api.AGENT_LIST, { params: queryParams });
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
  // if (filterDate.value) {
  //   queryParams.from = new Date(
  //     filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  //   ).toISOString();
  //   queryParams.to = new Date(
  //     filterDate.value[1].format("YYYY-MM-DD 23:59:59")
  //   ).toISOString();
  // }
  queryParams.page = 1;
  getListUser();
};

const createAgent = () => {
  showCreateModal.value = true;
};

const EditMdAgent = (value) => {
  curtableData.value = value;
  showEditModalAgent.value = true;
};

const AgentTransfer = (value) => {
  curtableData.value = value;
  showModalAgentTransfer.value = true;
};

const onCreatedAgent = () => {
  showCreateModal.value = false;
  getListUser();
};

const onEditAgent = () => {
  showEditModalAgent.value = false;
  getListUser();
};

const onAgentTransfer = () => {
  showModalAgentTransfer.value = false;
  getListUser();
};

const genStatus = (status) => {
  if (status) return $t('Partner.disable')
  else return $t('Partner.active')
}
getListUser();
</script>
