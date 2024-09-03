<template>
  <div class="flex flex-wrap gap-4 my-2">
    <!-- <a-input
      placeholder="Tìm kiếm"
      class="w-[200px]"
      v-model:value="queryParams.s"
    ></a-input> -->
    <!-- <a-range-picker v-model:value="filterDate" :locale="locale" /> -->
    <!-- <a-button @click="search" type="primary">Tìm kiếm</a-button> -->
<!--    <a-button @click="isShowAdd=true" type="primary">{{$t('add')}}</a-button>-->
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
          <AdminAction
            :data="record"
            @updated="onUpdated"
            @close="close"
          />
        </template>
         <template v-if="column.dataIndex === 'isDisabled'">
          <a-tag color="success" v-if="!record.isDisabled">{{
            genStatus(record.isDisabled)
          }}</a-tag>
          <a-tag color="red" v-else>{{ genStatus(record.isDisabled) }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'active'">
          <a-switch
            v-model:value="record.isDisabled"
            v-model:checked="record.isDisabled" :checked-children="$t('Partner.active')" :un-checked-children="$t('Partner.disable')" :checkedValue="0" :unCheckedValue="1"
            @click="updateAgent(record)"
          >
        </a-switch>
        </template>
      </template>
    </a-table>
   <AdminModel type="create"  @updated="onUpdated" v-if="isShowAdd" @close="close"/>
  </div>
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import request, {handleRequest} from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import UserAction from "@/components/Users/UserAction.vue";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import AdminModel from "@components/AdminSetting/AdminModal.vue"

import { useI18n } from "vue-i18n";
import AdminAction from "@components/AdminSetting/AdminAction.vue";
const { t: $t } = useI18n({ useScope: "global" });

const columns = [
  {
    title: $t('ID'),
    dataIndex: "seq",
  },
  {
    title: $t('User.userName'),
    dataIndex: "username",
  },
  {
    title: $t('Transaction.status'),
    dataIndex: "isDisabled",
    customRender: ({ text }) => genStatus(text),
  },
  {
    title: $t('User.typeUser'),
    dataIndex: "role",
    customRender: ({ text }) => genName(text),
  },
  {
    title: $t('User.active'),
    dataIndex: "active"
  },
  {
    title: $t('action'),
    key: "action",
  },
];
const genName = (name) => {
  if (name === 'agent') return $t('Partner.title')
}

const genStatus = (status) => {
  if (status) return $t('Partner.disable')
  else return $t('Partner.active')
}

const isShowAdd = ref(false);

const filterDate = ref([dayjs().startOf("days"), dayjs()]);

const queryParams = reactive({
  page: 1,
  limit: 10,
  from: new Date(
    filterDate.value[0].format("YYYY-MM-DD 00:00:00")
  ).toISOString(),
  to: new Date(filterDate.value[1].format("YYYY-MM-DD 23:59:59")).toISOString(),
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

const getListAgent = async () => {
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
  //   getListAgent();
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
  getListAgent();
};

const updateAgent = (data) => {
  const dataSend = {
    username: data.username,
    cskh: data?.cskh ?? '',
    password: '',
    isDisabled: data.isDisabled
  };
  handleRequest(
    request.patch(api.AGENT_CHANGE + `/${data._id}`, dataSend),
    () => {
      getListAgent()
    },
    $t("Partner.noitiUpdateAgentSuc")
  );
}

function onUpdated(record, payload) {
  getListAgent();
  isShowAdd.value = false;

}
function close() {
  isShowAdd.value = false;
}
getListAgent();
</script>
