<script setup>
import { reactive, computed, ref, defineProps } from "vue";
import request from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import { notification } from "ant-design-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const showModal = ref(true);
const emit = defineEmits(["close"]);
const props = defineProps({
  data: Object,
  isAdd: {
    type: Boolean,
    default: true
  }
});
function closeModal() {
  resetData()
  emit("close");
}
console.log(JSON.stringify(props.data));
const dataSubmit = reactive({
  level: props.isAdd ? 0 : props.data.level,
  rewardVip: props.isAdd ? 0 : props.data.rewardVip,
  rewardBirthday: props.isAdd ? 0 : props.data.rewardBirthday,
  moneyBet: props.isAdd ? 0 : props.data.moneyBet,
  totalMem: props.isAdd ? 0 : props.data.totalMem,
  rate: props.isAdd ? 0 : props.data.rate,
  condition: {
    condition_1: {
      number: props.isAdd ? 0 : props.data.condition[0]?.number ?? 0,
      numberVip: props.isAdd ? 0 : props.data.condition[0]?.numberVip ?? 0
    },
    condition_2: {
      number: props.isAdd ? 0 : props.data.condition[1]?.number ?? 0,
      numberVip: props.isAdd ? 0 : props.data.condition[1]?.numberVip ?? 0
    }
  }
});

const resetData = () => {
  dataSubmit.level = 0;
  dataSubmit.rewardVip = 0;
  dataSubmit.rewardBirthday = 0;
  dataSubmit.moneyBet = 0;
  dataSubmit.totalMem = 0;
  dataSubmit.rate = 0;
  dataSubmit.condition = {
    condition_1: {
      number: 0,
      numberVip: 0
    },
    condition_2: {
      number: 0,
      numberVip: 0
    }
  }
}

const submitAddOrEditVip = async () => {
  try {
    if (dataSubmit.level <= 0 ) {
      notification.error({
        message: $t("User.levelMustBeNumber"),
      });
      return;
    }
    const body = {
      level: Number(dataSubmit.level),
      rewardVip: Number(dataSubmit.rewardVip),
      rewardBirthday: Number(dataSubmit.rewardBirthday),
      moneyBet: Number(dataSubmit.moneyBet),
      totalMem: Number(dataSubmit.totalMem),
      rate: Number(dataSubmit.rate),
      condition: []
    }
    if (!!dataSubmit.condition.condition_1.number && !!dataSubmit.condition.condition_1.numberVip) {
      body.condition.push({
        number: Number(dataSubmit.condition.condition_1.number),
        numberVip: Number(dataSubmit.condition.condition_1.numberVip)
      });
    }
    if (!!dataSubmit.condition.condition_2.number && !!dataSubmit.condition.condition_2.numberVip) {
      body.condition.push({
        number: Number(dataSubmit.condition.condition_2.number),
        numberVip: Number(dataSubmit.condition.condition_2.numberVip)
      });
    }
    const res = props.isAdd ? await request.post(api.SETTING_VIP, body) : await request.put(api.SETTING_VIP + '/' + props.data._id, body);
    if (res.ok) {
      emit("updated");
      notification.success({
        message: props.isAdd ? $t("User.addVipSuccess") : $t("User.updateVipSuccess"),
      });
      closeModal();
    } else {
      notification.error({
        message: res.e ?? $t("error"),
      });
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: error.e ?? $t("error"),
    });
  }
};
</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('setting.addVip')"
    :onCancel="closeModal"
    :footer="null"
  >
    <a-form
      ref="createAccountForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item
        :label="$t('User.vip')"
        name="level"
        :rules="[
          { required: true, message: $t('User.vip') }
        ]"
      >
        <a-input
          type="number"
          v-model:value="dataSubmit.level"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('User.totalBet')"
        name="totalBet"
      >
        <a-input
          type="number"
          v-model:value="dataSubmit.moneyBet"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('User.members')"
        name="members"
      >
        <a-input
          type="number"
          v-model:value.trim="dataSubmit.totalMem"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('User.rewardVip')"
        name="rewardVip"
      >
        <a-input
          type="number"
          v-model:value="dataSubmit.rewardVip"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('User.rewardBirthday')"
        name="rewardBirthday"
      >
        <a-input
          type="number"
          v-model:value="dataSubmit.rewardBirthday"
        >
        </a-input>
      </a-form-item>

      <a-form-item :label="$t('User.condition_1')" name="condition_1">
        <div class="condition-inputs">
          <span>{{ $t('User.quantity') }}:</span>
          <a-input type="number" v-model:value="dataSubmit.condition.condition_1.number"></a-input>
          <span class="ml-2">Cấp vip:</span>
          <a-input type="number" v-model:value="dataSubmit.condition.condition_1.numberVip"></a-input>
        </div>
      </a-form-item>

      <a-form-item :label="$t('User.condition_2')" name="condition_2">
        <div class="condition-inputs">
          <span>{{$t('User.quantity')}}:</span>
          <a-input type="number" v-model:value="dataSubmit.condition.condition_2.number"></a-input>
          <span class="ml-2">{{$t('User.vip')}}:</span>
          <a-input type="number" v-model:value="dataSubmit.condition.condition_2.numberVip"></a-input>
        </div>
      </a-form-item>

      <a-form-item
        :label="$t('Transaction.rateVip')"
        name="rateVip"
      >
        <a-input
          type="number"
          v-model:value="dataSubmit.rate"
        >
        </a-input>
      </a-form-item>


      <div class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("User.destroy")
        }}</a-button>
        <a-button @click="submitAddOrEditVip" type="primary" html-type="submit">{{
          $t("User.send")
        }}</a-button>
        <!-- </div> -->
      </div>
    </a-form>
  </a-modal>
</template>
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
.condition-inputs {
  display: flex;
  align-items: center;
}

.condition-inputs span {
  margin-right: 8px; /* Adjust spacing as needed */
  min-width: 70px
}
</style>
