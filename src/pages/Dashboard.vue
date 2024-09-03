<script setup>
import { onMounted, reactive, ref } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import { formatNumber } from "@/helpers/format";
import request from "@/request";
import api from "@/request/api";
import { notification } from "ant-design-vue";

import { useI18n } from "vue-i18n";
import {ArrowLeftOutlined} from "@ant-design/icons-vue";
const { t: $t } = useI18n({ useScope: "global" });

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

const dateSelect = ref(dateOptions[0].value);

function onChangeSelectDate(value, option) {
  filterDate.value[0] = option.startDate();
}
const dashboard = reactive({
  totalUser: 0,
  totalUserList: [],
  online: 0,
  onlineList: [],
  totalUserToday: 0,
  totalUserTodayList: []
});

const showOnlineList = ref(false);
const currentList = ref([])
async function findByDate() {
  try {
    const res = await request.get(api.DASHBOARD, {
      params: {
        from: filterDate.value[0]
          ? new Date(
              filterDate.value[0].format("YYYY-MM-DD 00:00:00")
            ).toISOString()
          : null,
        to: new Date(
          filterDate.value[1].format("YYYY-MM-DD 23:59:59")
        ).toISOString(),
      },
    });
    if (!res.ok) {
      throw res;
    }

    Object.keys(res.d).forEach((e) => {
      dashboard[e] = res.d[e];
    });
  } catch (error) {
    notification.error({
      message: error.message,
    });
  }
}

async function showUser(type) {
  showOnlineList.value = true;
  if (type === 'online') currentList.value = dashboard.onlineList
  else if (type === 'all') currentList.value = dashboard.totalUserList
  else currentList.value = dashboard.totalUserTodayList
  console.log(currentList.value.length)
}

onMounted(() => {
  findByDate();
});
</script>
<template>
  <div class="flex flex-wrap gap-4 my-2">
    <a-range-picker v-model:value="filterDate" :locale="locale" />
    <a-select
      :options="dateOptions"
      v-model:value="dateSelect"
      @change="onChangeSelectDate"
    ></a-select>
    <a-button type="primary" @click="findByDate">{{ $t("search") }}</a-button>
    <a-button @click="$router.go(-1)" class="ml-3"><ArrowLeftOutlined></ArrowLeftOutlined></a-button>
  </div>

  <a-row :gutter="[16, 16]">
    <a-col :xs="{ span: 24 }" :lg="{ span: 8 }">
      <a-card @click="showUser('all')">
        <a-statistic
          :title="$t('Dashboard.user')"
          :value="dashboard.totalUser"
          :value-style="{ color: '#3f8600' }"
          style="margin-right: 50px"
        >
          <template #prefix>
            <arrow-up-outlined />
          </template>
        </a-statistic>
      </a-card>
    </a-col>
    <a-col :xs="{ span: 24 }" :lg="{ span: 8 }">
      <a-card @click="showUser('online')">
        <a-statistic
          :title="$t('Dashboard.online')"
          :value="dashboard.online"
          :value-style="{ color: '#3f8600' }"
        >
        </a-statistic>
      </a-card>
    </a-col>
    <a-col :xs="{ span: 24 }" :lg="{ span: 8 }">
      <a-card @click="showUser('today')">
        <a-statistic
          :title="$t('Dashboard.add')"
          :value="dashboard.totalUserToday"
          :value-style="{ color: '#3f8600' }"
        >
        </a-statistic>
      </a-card>
    </a-col>
     <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
      <a-card>
        <a-statistic
          :title="$t('Dashboard.totalDepositToday')"
          :value="dashboard.totalDeposit"
          :value-style="{ color: '#3f8600' }"
        >
        </a-statistic>
      </a-card>
    </a-col>
     <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
      <a-card>
        <a-statistic
          :title="$t('Dashboard.totalWithdrawToday')"
          :value="dashboard.totalWithDraw"
          :value-style="{ color: '#3f8600' }"
        >
        </a-statistic>
      </a-card>
    </a-col>
     <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
      <a-card>
        <a-statistic
          :title="$t('Dashboard.totalBetToday')"
          :value="Math.abs(dashboard.totalOrder)"
          :value-style="{ color: '#3f8600' }"
        >
        </a-statistic>
      </a-card>
    </a-col>
     <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
      <a-card>
        <a-statistic
          :title="$t('Dashboard.totalProfitToday')"
          :value="dashboard.totalProfit"
          :value-style="{ color: '#3f8600' }"
        >
        </a-statistic>
      </a-card>
    </a-col>
     <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
      <a-card>
        <a-statistic
          :title="$t('Dashboard.totalCommissionToday')"
          :value="dashboard.totalCommission"
          :value-style="{ color: '#3f8600' }"
        >
        </a-statistic>
      </a-card>
    </a-col>
     <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
      <a-card>
        <a-statistic
          :title="$t('Dashboard.totalGiftCodeToday')"
          :value="dashboard.totalGiftCode"
          :value-style="{ color: '#3f8600' }"
        >
        </a-statistic>
      </a-card>
    </a-col>
     <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
      <a-card>
        <a-statistic
          :title="$t('Dashboard.totalNotBrowseDeposit')"
          :value="dashboard.countNotBrowseDeposit"
          :value-style="{ color: '#faad14' }"
        >
        </a-statistic>
      </a-card>
    </a-col>

    <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
      <a-card>
        <a-statistic
          :title="$t('Dashboard.totalNotBrowseWidthdraw')"
          :value="dashboard.countNotBrowseWithdraw"
          :value-style="{ color: '#faad14' }"
        >
        </a-statistic>
      </a-card>
    </a-col>

<!--    <a-col :xs="{ span: 24 }" :lg="{ span: 8 }">-->
<!--      <a-card>-->
<!--        <a-statistic-->
<!--          :title="$t('Dashboard.totalNotBrowseDeposit')"-->
<!--          :value="dashboard.totalDWbrow"-->
<!--          :value-style="{ color: '#faad14' }"-->
<!--        >-->
<!--        </a-statistic>-->
<!--      </a-card>-->
<!--    </a-col>-->

<!--    <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">-->
<!--      <a-card>-->
<!--        <a-statistic-->
<!--          :title="$t('Dashboard.totalProfit')"-->
<!--          :value="dashboard.totalProfit"-->
<!--          :value-style="{ color: '#3f8600' }"-->
<!--        >-->
<!--        </a-statistic>-->
<!--      </a-card>-->
<!--    </a-col>-->

<!--    <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">-->
<!--      <a-card>-->
<!--        <a-statistic-->
<!--          :title="$t('Dashboard.totalLoss')"-->
<!--          :value="dashboard.totalLoss"-->
<!--          :value-style="{ color: '#ff4d4f' }"-->
<!--        >-->
<!--        </a-statistic>-->
<!--      </a-card>-->
<!--    </a-col>-->
  </a-row>

  <a-modal :title="$t('Dashboard.onlineList')" v-model:open="showOnlineList">
    <ul v-if="currentList.length" class="list-none">
      <li v-for="(item, index) in currentList" :key="index">
        <span>{{ index + 1 }}. </span> {{ item.displayName }}
      </li>
    </ul>
    <template v-else>
      {{ $t("Dashboard.NobodyOnline") }}
    </template>
  </a-modal>
</template>
