<template>
  <a-button @click="createBank" type="primary">
      <template #icon> <PlusOutlined /> </template>
  </a-button>
  <div class="overflow-y-auto">
    <a-table
      :columns="columns"
      :data-source="tableData.data"
      :loading="tableData.loading"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'isEnabled'">
          <a-badge
            :count="statusText(record.isEnabled)"
            :number-style="{ backgroundColor: statusColor(record.isEnabled) }"
          />
        </template>
        <template v-if="column.key === 'action'">
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="edit" @click="FuceditInfoBank(record)">
                  <EditOutlined />
                  {{ $t("edit") }}
                </a-menu-item>
                <a-menu-item key="edit" @click="curtableData = record, showDelete=true">
                  <DeleteOutlined />
                  {{ $t("delete") }}
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
  <EditInfoBank
    v-if="showModalEditInfoBank"
    @close="showModalEditInfoBank = false"
    @Edit="onEditInfoBank"
    :curtableData="curtableData"
  />
  <AddBank
    v-if="showAddBank"
    @close="showAddBank = false"
    @add="reload"
  >
  </AddBank>
  <a-modal v-model:open="showDelete" title="Xóa giao dịch">
    <p>Bạn có chắc muốn xóa bank này?</p>
    <template #footer>
       <a-button @click="() => showDelete = false"
        >Hủy</a-button
      >
      <a-button type="primary" @click="() => deleteBank()"
        >Xác nhận</a-button
      >
    </template>
  </a-modal>
</template>
<script setup>
import { reactive, ref } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import {MoreOutlined, EditOutlined, PlusOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import EditInfoBank from "@/components/Bank/EditInfoBank.vue";

import { useI18n } from "vue-i18n";
import AddBank from "@components/Bank/AddBank.vue";
import {notification} from "ant-design-vue";
const { t: $t } = useI18n({ useScope: "global" });

const columns = [
  {
    title: $t("Bank.nameBank"),
    dataIndex: "bankName",
  },

  {
    title: $t("acountNumber"),
    dataIndex: "accountNumber",
  },

  {
    title: $t("User.acoutName"),
    dataIndex: "accountName",
  },

  {
    title: $t("Bank.status"),
    key: "isEnabled",
  },

  {
    title: $t("createDate"),
    dataIndex: "createdAt",
    customRender: ({ text }) => formatDateTime(text),
  },

  {
    title: $t("action"),
    key: "action",
  },
];
const showModalEditInfoBank = ref(false);
const curtableData = ref({});
const showAddBank = ref(false)
const showDelete = ref(false)
const tableData = reactive({
  data: [],
  loading: false,
});


const deleteBank = async () => {
  try {
    const res = await request.delete(`${api.ADMIN_BANK}/${curtableData.value._id}`);
    if (res.ok) {
      notification.success({
        message: $t("Bank.success"),
      });
      showDelete.value = false;
      reload();
    }
  } catch (error) {
    console.log(error);
    notification.error({
        message: error.e,
      });
  }
}


const reload = () => {
  showAddBank.value = false
  getListBank();
}
const getListBank = async () => {
  try {
    tableData.loading = true;
    const res = await request.get(api.ADMIN_BANK);
    if (res.ok) {
      tableData.data = res.d;
    }
  } catch (error) {
    console.log(error);
  } finally {
    tableData.loading = false;
  }
};

const createBank = () => {
  showAddBank.value = true;
}

const onEditInfoBank = () => {
  showModalEditInfoBank.value = false;
  getListBank();
};
const FuceditInfoBank = (value) => {
  curtableData.value = value;
  showModalEditInfoBank.value = true;
};


function statusText(isEnabled) {
  switch (isEnabled) {
    case 0:
      return $t("Bank.deactivate");
    case 1:
      return $t("Bank.activated");
    default:
      return isEnabled;
  }
}

function statusColor(isEnabled) {
  switch (isEnabled) {
    case 0:
      return "#ffc107";
    case 1:
      return "#28a745";
    default:
      return "#6c757d";
  }
}
getListBank();
</script>
