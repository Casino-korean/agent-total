<template>
<!--  <a-button type="primary" @click="showAddUserModal = true">Thêm</a-button>-->
  <div class="flex flex-wrap gap-4 my-2">
<!--    <a-input-->
<!--      :placeholder="$t('User.id')"-->
<!--      class="w-[200px]"-->
<!--      v-model:value="queryParams.id"-->
<!--    ></a-input>-->
    <a-input
      :placeholder="$t('searchByUsername')"
      class="w-[200px]"
      v-model:value="queryParams.s"
    ></a-input>
    <a-input
      :placeholder="$t('userAgent')"
      class="w-[200px]"
      v-model:value="queryParams.agent"
    ></a-input>
     <a-input
      :placeholder="'VIP'"
      class="w-[200px]"
      type="number"
      v-model:value="queryParams.vip"
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
        <template v-if="column.dataIndex === 'vip'">
          <span>{{record?.vip || 0 }}</span>
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
                <a-menu-item key="history" @click="onAddMoneyClicked(record)">
                   <DollarOutlined />
                {{ $t("User.DeleteAddMoney") }}
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

  <AddUserModal
    v-if="showAddUserModal"
    @close="showAddUserModal = false"
    @updated="onUpdated"
  />

  <a-modal v-model:open="showAddMoneyModal" :title="$t('User.DeleteAddMoney') + ' ' +  curtableData.username">
    <div class="flex flex-col gap-2">
       <a-form-item :label="$t('Giftcode.amountOfMoney')" name="name">
        <a-input v-model:value="moneyData" />
      </a-form-item>
      <a-form-item :label="$t('Transaction.note')" name="name">
        <a-input v-model:value="note" />
      </a-form-item>
<!--      <a-input-->
<!--        placeholder="Nhập số tiền"-->
<!--        v-model:value="moneyData"-->
<!--      ></a-input>-->
    </div>

    <template #footer>
      <a-button type="primary" danger @click="() => submitMoney(-1)"
        >Trừ tiền</a-button
      >
      <a-button type="primary" @click="() => submitMoney(1)"
        >Cộng tiền</a-button
      >
    </template>
  </a-modal>
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import { notification } from "ant-design-vue";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import HistoryPlay from "@/components/Users/HistoryPlay.vue";
import ModalSendLetterPrivate from "@/components/Letter/ModalSendLetterPrivate.vue";
import EditUserModal from "@/components/Users/EditUserModal.vue";
import AddUserModal from "@/components/Users/AddUserModal.vue"

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

import {
  MoreOutlined,
  HistoryOutlined,
  EditOutlined,
  MessageOutlined,
  DollarOutlined, ArrowLeftOutlined
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
    title: $t("User.phoneNumber"),
    dataIndex: "phone",
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
    title: $t("User.wallet"),
    dataIndex: "money",
    customRender: ({ text }) => formatNumber(text),
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
  // {
  //   title: $t("User.moneyFromGiftcode"),
  //   dataIndex: "giftcodeSum",
  //   customRender: ({ text }) => formatNumber(text),
  // },
  {
    title: $t("User.bankName"),
    dataIndex: "bankName",
  },
  {
    title: $t("User.accountNumber"),
    dataIndex: "accountNumber",
  },
  {
    title: $t("User.accountName"),
    dataIndex: "accountName",
  },

  {
    title: $t("User.accountCreateDate"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },

  {
    title: $t("User.level"),
    dataIndex: "level"
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
const moneyData = ref(0);
const note = ref('');
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
const showAddMoneyModal = ref(false);
const onEditUserClicked = (value) => {
  curtableData.value = value;
  showEditModal.value = true;
};

const onAddMoneyClicked = (value) => {
  curtableData.value = value;
  showAddMoneyModal.value = true;
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
});

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

const submitMoney = async (type) => {
  try {
    const data = {
      amount: Number(type * moneyData.value),
      type: type === 1 ? 'deposit' : 'withdraw',
      note: note.value
    };
    const res = await request.patch(
        api.TRANSACTIONS_ADD_MONEY + `/${curtableData.value._id}`,
        data
    );
    if (res.ok) {
      notification.success({
        message: "Duyệt giao dịch thành công",
      });
      showAddMoneyModal.value = false;
      moneyData.value = 0
      await getListUser()
    } else {
       notification.error({
        message: res.message,
      });
    }
  } catch (error) {
      notification.error({
      message: error.message,
    });
  }
}

getListUser();
</script>
