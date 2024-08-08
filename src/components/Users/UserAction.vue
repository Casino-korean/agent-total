<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import {
  MoreOutlined,
  EditOutlined,
  DollarOutlined,
} from "@ant-design/icons-vue";
import { formatNumber, formatDateTime } from "@/helpers/format";
import { notification } from "ant-design-vue";

import request from "@/request";
import api from "@/request/api";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps({
  data: Object,
});

const emit = defineEmits(["updated"]);

const showMoneyModal = ref(false);

const moneyData = reactive({
  amount: 0,
});

function handleClickMenu(e) {
  switch (e.key) {
    case "money":
      moneyData.amount = 0;
      showMoneyModal.value = true;
      break;

    default:
      break;
  }
}

async function submitMoney(type) {
  try {
    const data = {
      amount: moneyData.amount * type,
    };
    const res = await request.patch(
      api.USER_MONEY + `/${props.data._id}`,
      data
    );
    if (res.success) {
      notification.success({
        message: $t("User.approvalpaySuc"),
      });
      showMoneyModal.value = false;
      emit("updated", res.data);
    } else {
      throw res;
    }
  } catch (error) {
    console.log(error.message);
    notification.error({
      message: error.message,
    });
  }
}
</script>

<template>
  <a-dropdown>
    <template #overlay>
      <a-menu @click="handleClickMenu">
        <a-menu-item key="money">
          <DollarOutlined />
          {{ $t("User.DeleteAddMoney") }}
        </a-menu-item>
      </a-menu>
    </template>
    <a-button type="primary" size="">
      <!-- Chi tiết -->
      <MoreOutlined />
    </a-button>
  </a-dropdown>

  <a-modal v-model:open="showMoneyModal" :title="$t('User.aproTrading')">
    <div class="flex flex-col gap-2">
      <a-input
        :placeholder="$t('User.ipMoney')"
        v-model:value="moneyData.amount"
      ></a-input>
    </div>

    <template #footer>
      <a-button type="primary" danger @click="() => submitMoney(-1)">{{
        $t("User.deduction")
      }}</a-button>
      <a-button type="primary" @click="() => submitMoney(1)">{{
        $t("User.addMoney")
      }}</a-button>
    </template>
  </a-modal>
</template>
