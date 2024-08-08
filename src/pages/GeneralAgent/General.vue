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
        <template v-if="column.key === 'name-agent'">
          <div>{{ record.name }}</div>
          <a-badge
            :count="$t('Partner.DlDepoWiAcronym')"
            v-if="record.isAgentGlobalTransferMoney"
          />
        </template>
        <template v-if="column.key === 'action'">
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="EditMdAgent(record)" key="1">
                  <EditOutlined />
                  {{ $t("edit") }}
                </a-menu-item>
<!--                <a-menu-item @click="AgentTransfer(record)" key="2">-->
<!--                  <TransactionOutlined />-->
<!--                  {{ $t("Partner.agentPay") }}-->
<!--                </a-menu-item>-->
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
  <AddGeneralAgentModal
    v-if="showCreateModal"
    @close="showCreateModal = false"
    @updated="onCreatedAgent"
  />
  <EditGeneralAgent
    v-if="showEditModalAgent"
    @close="showEditModalAgent = false"
    @Edit="onEditAgent"
    :curtableData="curtableData"
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

import dayjs from "dayjs";
import EditAgent from "@components/Agent/EditAgent.vue";
import ModalAgentGlobalTransferMoney from "@components/Agent/ModalAgentGlobalTransferMoney.vue";

import { useI18n } from "vue-i18n";
import AddAgentModal from "@components/Agent/AddAgentModal.vue";
import AddGeneralAgentModal from "@components/GeneralAgent/AddGeneralAgentModal.vue";
import EditGeneralAgent from "@components/GeneralAgent/EditGeneralAgent.vue";
const { t: $t } = useI18n({ useScope: "global" });

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
    title: $t("User.phone"),
    dataIndex: "phone",
  },
   {
    title: $t("User.refernalCode"),
    dataIndex: "refCode",
  },
   {
    title: $t("User.agentSum"),
    dataIndex: "agentSum",
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

const curtableData = ref({});
const showCreateModal = ref(false);
const showEditModalAgent = ref(false);
const showModalAgentTransfer = ref(false);

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
    const res = await request.get(api.GENERAL_AGENT_LIST, { params: queryParams });
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

getListUser();
</script>
