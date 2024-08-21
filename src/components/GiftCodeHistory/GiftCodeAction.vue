<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";
import {MoreOutlined, CheckCircleOutlined, DeleteOutlined, DollarOutlined} from "@ant-design/icons-vue";
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

const showApproveModal = ref(false);
const showMoneyModal = ref(false);
const showDeleteTrans = ref(false);
const approvalData = reactive({
  status: null,
});

const optionType = [
    { value: 1, label: $t("Transaction.up") },
    { value: -1, label: $t("Transaction.down") },
];
const moneyData = reactive({
  amount: 0,
  note: null,
  typeMoney: 'vnd',
  type: 1
});

function reset() {
  moneyData.amount = 0,
  moneyData.note= null,
  moneyData.typeMoney= 'vnd',
  moneyData.type= 1
}


function handleClickMenu(e) {
  switch (e.key) {
    case "1":
      showApproveModal.value = true;
      break;
    case "money":
      showMoneyModal.value = true;
      break;
    default:
      break;
  }
}

async function submitApproval() {
  try {
    const res = await request.post(
      api.GIFTCODE_APPROVE + `${props.data._id}`,
      approvalData
    );
    if (res.ok) {
      notification.success({
        message: $t("Transaction.noitiAproSuc"),
      });
      showApproveModal.value = false;
      emit("updated", res.data);
    } else {
      throw res;
    }
  } catch (error) {
    notification.error({
      message: error.e,
    });
  }
}

async function deleteTransaction() {
  try {
    const res = await request.delete(api.TRANSACTION + "/" + props.data._id);
    if (res.ok) {
      emit("updated");
      notification.success({
        message: $t("delete_success"),
      });
      showDeleteTrans.value = false;
    } else {
      notification.error({
        message: res.e ?? $t("error"),
      });
      showDeleteTrans.value = false;
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: error.e ?? $t("error"),
    });
  }
}
async function submitMoney() {
  try {
    const body = {
      amount: moneyData.amount*moneyData.type,
      note: moneyData.note,
      typeMoney: moneyData.typeMoney,
      type: moneyData.type === 1 ? 'deposit' : 'withdraw'
    }
    const res = await request.patch(
      api.TRANSACTIONS_ADD_MONEY + `/${props.data.userId}`,
      body
    );
    if (res.ok) {
      notification.success({
        message: $t("User.approvalpaySuc"),
      });
      showMoneyModal.value = false;
      emit("updated", res.d);
    } else {
      throw res;
    }
  } catch (error) {
    notification.error({
      message: error.e,
    });
  } finally {
    reset()
  }
}

function approveTransaction(status) {
  approvalData.status = status;
  submitApproval();
}
</script>

<template>
  <a-dropdown>
    <template #overlay>
      <a-menu @click="handleClickMenu">
        <a-menu-item key="1">
          <CheckCircleOutlined />
          {{ $t("Transaction.Approve") }}
        </a-menu-item>
<!--        <a-menu-item @click="showDeleteTrans = true">-->
<!--          <DeleteOutlined />-->
<!--          {{ $t("delete") }}-->
<!--        </a-menu-item>-->
<!--        <a-menu-item key="money">-->
<!--          <DollarOutlined />-->
<!--          {{ $t("User.DeleteAddMoney") }}-->
<!--        </a-menu-item>-->
      </a-menu>
    </template>
    <a-button type="primary" size="">
      <!-- Chi tiết -->
      <MoreOutlined />
    </a-button>
  </a-dropdown>
  <a-modal v-model:open="showApproveModal" :title="$t('User.aproTrading')">
    <div class="flex flex-col gap-2">
      <div>
        {{ $t("Dashboard.user") }}: <b>{{ (data?.user?.username || data?.fromUser?.username) ?? '' }}</b>
      </div>
      <div>
        {{ $t("Giftcode.amountOfMoney") }} :
        <b>{{ formatNumber(data.money) }}</b>
      </div>
      <a-input
        :placeholder="$t('Transaction.enterNote')"
        v-model:value="approvalData.note"
      ></a-input>
    </div>

    <template #footer>
      <a-button type="primary" danger @click="() => approveTransaction(2)" :disabled="data.status === 1">
        {{ $t("Transaction.refuse") }}</a-button
      >
      <a-button type="primary" @click="() => approveTransaction(1)" :disabled="data.status === 1">
        {{ $t("User.send") }}</a-button
      >
    </template>
  </a-modal>
<!--  <a-modal v-model:open="showDeleteTrans" title="Xóa giao dịch">-->
<!--    <p>Bạn có chắc muốn xóa giao dịch này?</p>-->
<!--    <template #footer>-->
<!--       <a-button @click="() => showDeleteTrans = false"-->
<!--        >Hủy</a-button-->
<!--      >-->
<!--      <a-button type="primary" @click="() => deleteTransaction()"-->
<!--        >Xác nhận</a-button-->
<!--      >-->
<!--    </template>-->
<!--  </a-modal>-->
<!--  <a-modal v-model:open="showMoneyModal" :title="$t('Transaction.edit_money')">-->
<!--    <div class="flex flex-col gap-2">-->
<!--&lt;!&ndash;       <a-form-item :label="$t('Transaction.edit_money')" name="location" class="custom-label">&ndash;&gt;-->
<!--&lt;!&ndash;        <a-input&ndash;&gt;-->
<!--&lt;!&ndash;          :placeholder="$t('User.ipMoney')"&ndash;&gt;-->
<!--&lt;!&ndash;          v-model:value="moneyData.amount"&ndash;&gt;-->
<!--&lt;!&ndash;        ></a-input>&ndash;&gt;-->
<!--&lt;!&ndash;      </a-form-item>&ndash;&gt;-->

<!--      <a-form-item :label="$t('Transaction.amount')" name="location" class="custom-label">-->
<!--        <a-input-->
<!--          :placeholder="$t('User.ipMoney')"-->
<!--          v-model:value="moneyData.amount"-->
<!--        ></a-input>-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('Transaction.note')" name="location" class="custom-label">-->
<!--        <a-input-->
<!--          :placeholder="$t('Transaction.enterNote')"-->
<!--          v-model:value="moneyData.note"-->
<!--        ></a-input>-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('Transaction.up_or_down')" name="location" class="custom-label">-->
<!--        <a-select-->
<!--        :options="optionType"-->
<!--        class="w-[200px]"-->
<!--        v-model:value="moneyData.type"-->
<!--      ></a-select>-->
<!--      </a-form-item>-->
<!--      <a-form-item :label="$t('Transaction.typeMoney')" name="location" class="custom-label">-->
<!--         <a-select-->
<!--        :options="optionMoney"-->
<!--          class="w-[200px]"-->
<!--          v-model:value="moneyData.typeMoney"-->
<!--        ></a-select>-->
<!--      </a-form-item>-->
<!--    </div>-->

<!--    <template #footer>-->
<!--      <a-button type="primary" danger @click="() => showMoneyModal=false">{{-->
<!--        $t("cancel")-->
<!--      }}</a-button>-->
<!--      <a-button type="primary" @click="() => submitMoney()">{{-->
<!--        $t("save")-->
<!--      }}</a-button>-->
<!--    </template>-->
<!--  </a-modal>-->
</template>

<style type="text/css">
.custom-label .ant-form-item-label {
    width: 110px;
    text-align: left;
  }

</style>
