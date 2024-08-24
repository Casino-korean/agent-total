<script setup>
import CreateGiftCode from "@/components/GiftCode/CreateGiftCode.vue";
import ModalChangeGiftcode from "@/components/GiftCode/ModalChangeGiftcode.vue";
import { reactive, computed, ref } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import dayjs from "dayjs";
import {
  EditOutlined,
  DownOutlined,
  DeleteOutlined, ArrowLeftOutlined,
} from "@ant-design/icons-vue";

import { useI18n } from "vue-i18n";
import {notification} from "ant-design-vue";
const { t: $t } = useI18n({ useScope: "global" });

const isShowModalCreateGiftCode = ref(false);
const isShowModalChangeGiftcode = ref(false);
const showDeleteGiftCode = ref(false);

const filterDate = ref([dayjs().startOf("month"), dayjs()]);

const columns = [
  {
    title: $t("Giftcode.type"),
    dataIndex: "type",
    customRender: ({ text }) =>
      text === 0 ? $t("Giftcode.multipleUses") : $t("Giftcode.limitedTime"),
  },
  {
    title: $t("Giftcode.event"),
    dataIndex: "event"
  },
  {
    title: $t("Giftcode.code"),
    dataIndex: "code",
  },
  {
    title: $t("Giftcode.amount"),
    dataIndex: "amount",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("Giftcode.termsOfUse"),
    key: "conditional",
  },

  {
    title: $t("Giftcode.quantityuse"),
    dataIndex: "countByUser",
    customRender: ({ text }) => formatNumber(text),
  },

  {
    title: $t("Giftcode.ExpireStatus"),
    dataIndex: "isExpired",
    customRender: ({ text }) =>
      text === 1 ? $t("Giftcode.ExpireStatus") : $t("Giftcode.notExpired"),
  },

  {
    title: $t("Giftcode.createDate"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },
  {
    title: $t("action"),
    key: "action",
  },
];

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

const curtableData = ref({});

const pagination = computed(() => ({
  total: tableData.total,
  current: queryParams.page,
  pageSize: queryParams.limit,
}));
const getListGiftCode = async () => {
  showDeleteGiftCode.value = false;
  try {
    tableData.loading = true;
    const res = await request.get(api.GIFTCODE_LIST, { params: queryParams });
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
  getListGiftCode();
};

function onUpdate(value) {
  curtableData.value = value;
  isShowModalChangeGiftcode.value = true;
}

function onUpdateAfterUp() {
  isShowModalChangeGiftcode.value = false;
  getListGiftCode();
}
function onUpdateAfterCreate() {
  isShowModalCreateGiftCode.value = false;
  getListGiftCode();
}

async function onDelete() {
  try {
    const res = await request.delete(api.GIFTCODE + '/' + curtableData.value._id);
    if (res.ok) {
      notification.success({
        message: $t("Bank.success"),
      });
      await getListGiftCode();
    } else {
      notification.error({
        message: res.e,
      });
    }
  } catch (error) {
    notification.error({
        message: error.e,
      });
  }
}

getListGiftCode();
</script>

<template>
  <div class="flex flex-wrap gap-4 my-2">
    <a-input
      :placeholder="$t('search')"
      class="w-[200px]"
      v-model:value="queryParams.s"
    ></a-input>
    <a-button type="primary">{{ $t("search") }}</a-button>
    <a-button @click="isShowModalCreateGiftCode = true" type="primary">{{
      $t("Giftcode.createGif")
    }}</a-button>
    <a-button @click="$router.go(-1)" class="ml-3"><ArrowLeftOutlined></ArrowLeftOutlined></a-button>
    <div class="flex items-center w-full justify-end">
      <a-descriptions-item>
        {{$t("page")}} {{pagination.current + '-' + pagination.pageSize}} , {{ $t("haveALl") }} {{ tableData.total }} {{ $t("record") }}
      </a-descriptions-item>
    </div>
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
          <div v-if="record.type === 1">
            {{ $t("Giftcode.endDate") }} :{{
              ` ${formatDateTime(record.data)}`
            }}
          </div>
          <div v-if="record.type === 0">
            {{ $t("Giftcode.numberOfTimes") }} :
            {{ `${formatNumber(record.count)}` }}
          </div>
        </template>
        <template v-if="column.key === 'action'">
          <a-dropdown>
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="1" @click="onUpdate(record)">
                  <EditOutlined />
                  {{ $t("update") }}
                </a-menu-item>
                <a-menu-item key="2" @click="curtableData = record, showDeleteGiftCode = true">
                  <DeleteOutlined />
                  Xóa
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              {{ $t("action") }}
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:open="showDeleteGiftCode" title="Xóa giao dịch">
    <p>Bạn có chắc muốn xóa gift code này?</p>
    <template #footer>
       <a-button @click="() => showDeleteGiftCode = false"
        >Hủy</a-button
      >
      <a-button type="primary" @click="() => onDelete()"
        >Xác nhận</a-button
      >
    </template>
  </a-modal>
  <ModalChangeGiftcode
    v-if="isShowModalChangeGiftcode"
    @close="isShowModalChangeGiftcode = false"
    :curtableData="curtableData"
    @update="onUpdateAfterUp"
  />
  <CreateGiftCode
    v-if="isShowModalCreateGiftCode"
    @close="isShowModalCreateGiftCode = false"
    @update="onUpdateAfterCreate"
  />
</template>
