<template>
<!--  <a-button type="primary" @click="showAddUserModal = true">Thêm</a-button>-->
  <div class="flex flex-wrap gap-4 my-2">
<!--    <a-input-->
<!--      :placeholder="$t('User.id')"-->
<!--      class="w-[200px]"-->
<!--      v-model:value="queryParams.id"-->
<!--    ></a-input>-->
<!--    <a-input-->
<!--      :placeholder="$t('searchByUsername')"-->
<!--      class="w-[200px]"-->
<!--      v-model:value="queryParams.s"-->
<!--    ></a-input>-->
    <a-input
      :placeholder="$t('userAgent')"
      class="w-[200px]"
      v-model:value="queryParams.agent"
    ></a-input>
     <a-input
      :placeholder="$t('CSKH')"
      class="w-[200px]"
      v-model:value="queryParams.general"
    ></a-input>
    <a-select
       :placeholder="$t('Transaction.userType')"
      :options="optionUserType"
      class="w-[200px]"
      v-model:value="queryParams.type"
    ></a-select>
     <a-input
      :placeholder="'Level'"
      class="w-[200px]"
      type="number"
      v-model:value="queryParams.level"
    ></a-input>
    <a-range-picker v-model:value="filterDate" :locale="locale" />
    <a-select
      :options="dateOptions"
      v-model:value="dateSelect"
      @change="onChangeSelectDate"
    ></a-select>
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

           <template v-if="column.dataIndex === 'vip'">
            <span :style="{ color: 'red', fontWeight: 700 }">{{
              record?.vip
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

          <template v-if="column.key === 'role'">
            <span :style="{ color: '#b94a48', fontWeight: 700 }">{{
              record?.role === 'user' ? 'Người chơi' : 'Sale'
            }}</span>
          </template>

           <template v-if="column.dataIndex === 'winLossSum'">
            <span :style="{ color: record.winLossSum >= 0 ? 'green' : 'red' , fontWeight: 700 }">{{
              formatNumber(record?.winLossSum ?? 0)
            }}</span>
          </template>

          <template v-if="column.dataIndex === 'level'">
            <span class="label label-default"> Cấp {{
              record.level
            }}</span>
          </template>
        <template v-if="column.key === 'action'">
          <!-- <UserAction :data="record" @updated="(e) => onUpdated(record, e)" /> -->
          <!-- <SendPrivateLetter
            :data="record"
            @updated="(e) => onUpdated(record, e)"
          /> -->
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="edit" @click="onSendLetterPrivate(record)">
                  <MessageOutlined />
                  {{ $t("mailing") }}
                </a-menu-item>
                <a-menu-item key="history" @click="onHistoryPlay(record)">
                  <HistoryOutlined />
                  {{ $t("playHistory") }}
                </a-menu-item>
                <a-menu-item key="history" @click="onEditUserClicked(record)">
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
      </template>
    </a-table>
  </div>
  <ModalSendLetterPrivate
    v-if="showModalSendPrivateLetter"
    @close="showModalSendPrivateLetter = false"
    :curtableData="curtableData"
    @updated="onUpdated"
  />
  <HistoryPlay
    v-if="showModalHistoryPlay"
    @close="showModalHistoryPlay = false"
    :curtableData="curtableData"
  />

  <EditUserModal
    v-if="showEditModal"
    @close="showEditModal = false"
    @updated="onUpdated"
    :curtableData="curtableData"
  />

<!--  <AddUserModal-->
<!--    v-if="showAddUserModal"-->
<!--    @close="showAddUserModal = false"-->
<!--    @updated="onUpdated"-->
<!--  />-->
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

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

import {
  MoreOutlined,
  HistoryOutlined,
  EditOutlined,
  MessageOutlined, ArrowLeftOutlined,
} from "@ant-design/icons-vue";

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
    title: $t("User.typeAccount"),
    key: "role",
  },
  {
    title: $t("User.vip"),
    dataIndex: "vip",
  },
   {
    title: $t("User.refernalCode"),
    dataIndex: "refCode",
  },
   {
    title: $t("User.userSum"),
    dataIndex: "userSum",
  },

  {
    title: $t("User.level"),
    dataIndex: "level"
  },
  // {
  //   title: $t("User.wallet"),
  //   dataIndex: "money",
  //   customRender: ({ text }) => formatNumber(text),
  // },
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
  {
    title: $t("User.commissionGame"),
    dataIndex: "commissionGame",
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
  // {
  //   title: $t("User.bankName"),
  //   dataIndex: "bankName",
  // },
  // {
  //   title: $t("User.accountNumber"),
  //   dataIndex: "accountNumber",
  // },
  // {
  //   title: $t("User.accountName"),
  //   dataIndex: "accountName",
  // },

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

const showAddUserModal = ref(false);

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
  general: null, // dai ly tong
  type: null
});

const optionUserType = [
    { value: null, label: $t("all") },
    { value: 'user', label: $t("user") },
    { value: 'agent', label: $t("agent") },
];

const tableData = reactive({
  data: [],
  loading: false,
  total: 0,
});
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
const dateSelect = ref(dateOptions[2].value);
const onChangeSelectDate = (value, option) => {
  filterDate.value[0] = option.startDate();
}
const pagination = computed(() => ({
  total: tableData.total,
  current: queryParams.page,
  pageSize: queryParams.limit,
}));

const getListUser = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.USER_LIST, { params: queryParams });
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
  await getListUser();
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
<style lang="scss">
.label {
  display: inline;
  padding: .2em .6em .3em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
}
.label-default {
  background-color: #6c757d;
}
</style>
