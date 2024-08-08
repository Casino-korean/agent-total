<script setup>
import { reactive, ref } from "vue";
import request, { handleRequest } from "@/request";
import api from "@/request/api";
import { UploadOutlined } from "@ant-design/icons-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const form = ref(null);
const formData = reactive({
  // minDeposit: 1,
  // maxDeposit: 1,
  // minWithdraw: 1,
  // maxWithdraw: 1,
  // ratioMoney: 1,
  // ratioDeposit: 1,
  // bankName: "",
  // bankNumber: "",
  // bankHolder: "",
  // bankImage: "",
  fanpage: "",
});

function onFinish() {
  submitSystenSettings();
}

function gettSystenSettings() {
  handleRequest(request.get(api.SETTINGS_SYSTEM), ({ d: data }) => {
    data.forEach(e => {
      const [ key, value] = [e.key, e.value]
      if (formData.hasOwnProperty(key)) {
        formData[key] = value; 
      }
    });
    // Object.assign(formData, {
    //   minDeposit: data.minDeposit ?? 1,
    //   maxDeposit: data.maxDeposit ?? 1,
    //   minWithdraw: data.minWithdraw ?? 1,
    //   maxWithdraw: data.maxWithdraw ?? 1,
    //   ratioMoney: data.ratioMoney ?? 1,
    //   ratioDeposit: data.ratioDeposit ?? 1,
    //   bankName: data.bank?.bankName ?? "",
    //   bankNumber: data.bank?.accountNumber ?? "",
    //   bankHolder: data.bank?.holder ?? "",
    //   bankImage: data.bank?.image ?? "a",
    // });
  });
}

function submitSystenSettings() {
  // const submitData = {
  //   minDeposit: formData.minDeposit,
  //   maxDeposit: formData.maxDeposit,
  //   minWithdraw: formData.minWithdraw,
  //   maxWithdraw: formData.maxWithdraw,
  //   ratioMoney: formData.ratioMoney,
  //   ratioDeposit: formData.ratioDeposit,
  //   bank: {
  //     bankName: formData.bankName,
  //     accountNumber: formData.bankNumber,
  //     holder: formData.bankHolder,
  //     image: formData.bankImage,
  //   },
  // };
  handleRequest(
    request.put(api.SETTINGS_SYSTEM, formData),
    null,
    $t("setting.updateSystem")
  );
}

function uploadImage({ onSuccess, file }) {
  const data = new FormData();
  data.append("file", file);
  handleRequest(
    request.post(api.UTIL_UPLOAD, data),
    async (res) => {
      formData.bankImage = res.data;
      await form.value.validate();
      file.url = import.meta.env.VITE_APP_CDN_URL + "/" + res.data;
      onSuccess(file);
    },
    $t("setting.downloadImgeSuc")
  );
}

function imagePath(image) {
  return import.meta.env.VITE_APP_CDN_URL + "/" + image;
}

gettSystenSettings();
</script>

<template>
  <a-form autocomplete="off" ref="form" :model="formData" @finish="onFinish">
    <!-- <a-card :title="$t('setting.moneyWD')" class="nap-rut">
      <div class="flex flex-wrap">
        <a-form-item
          class="mb-1 form-item"
          :label="$t('setting.minDeposit')"
          name="minDeposit"
          :rules="[
            { required: true, message: $t('setting.moneyEr') },
            { type: 'number', min: 1, message: $t('setting.moneyMinEr') },
          ]"
        >
          <a-input-number
            v-model:value="formData.minDeposit"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            class="form-input"
          >
          </a-input-number>
        </a-form-item>

        <a-form-item
          class="mb-1 form-item"
          label="Max Nạp"
          name="maxDeposit"
          :rules="[
            { required: true, message: 'Vui lòng nhập số tiền.' },
            { type: 'number', min: 1, message: 'Số tiền nhỏ nhất là 1.' },
          ]"
        >
          <a-input-number
            v-model:value="formData.maxDeposit"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            class="form-input"
          >
          </a-input-number>
        </a-form-item>
      </div>
      <div class="flex flex-wrap">
        <a-form-item
          class="mb-1 form-item"
          :label="$t('setting.minWidthDraw')"
          name="minWithdraw"
          :rules="[
            { required: true, message: $t('setting.moneyEr') },
            { type: 'number', min: 1, message: $t('setting.moneyMinEr') },
          ]"
        >
          <a-input-number
            v-model:value="formData.minWithdraw"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            class="form-input"
          >
          </a-input-number>
        </a-form-item>

        <a-form-item
          class="mb-1 form-item"
          label="Max Rút"
          name="maxWithdraw"
          :rules="[
            { required: true, message: 'Vui lòng nhập số tiền.' },
            { type: 'number', min: 1, message: 'Số tiền nhỏ nhất là 1.' },
          ]"
        >
          <a-input-number
            v-model:value="formData.maxWithdraw"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            class="form-input"
          >
          </a-input-number>
        </a-form-item>
      </div>
    </a-card>

    <a-card :title="$t('setting.ratioWD')" class="nap-rut">
      <div class="flex flex-wrap">
        <a-form-item
          class="mb-1 form-item"
          :label="$t('setting.ratioWidthdraw')"
          name="ratioMoney"
          :rules="[{ required: true, message: $t('setting.noitiErWidth') }]"
        >
          <a-input-number
            v-model:value="formData.ratioMoney"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            class="form-input"
          >
          </a-input-number>
        </a-form-item>
      </div>
      <div class="flex flex-wrap">
        <a-form-item
          class="mb-1 form-item"
          :label="$t('setting.ratioDeposit')"
          name="ratioDeposit"
          :rules="[{ required: true, message: $t('setting.noitiErWidth') }]"
        >
          <a-input-number
            v-model:value="formData.ratioDeposit"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            class="form-input"
          >
          </a-input-number>
        </a-form-item>
      </div>
    </a-card>

    <a-card :title="$t('setting.accoutBank')" class="bank">
      <a-form-item
        class="mb-1 form-item"
        :label="$t('bank')"
        name="bankName"
        :rules="[{ required: true, message: $t('setting.noitiErNameBank') }]"
      >
        <a-input v-model:value="formData.bankName" class="form-input">
        </a-input>
      </a-form-item>
      <a-form-item
        class="mb-1 form-item"
        :label="$t('acountNumber')"
        name="bankNumber"
        :rules="[{ required: true, message: $t('setting.noitiErAcnumber') }]"
      >
        <a-input
          v-model:value="formData.bankNumber"
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          class="form-input"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        class="mb-1 form-item"
        :label="$t('useBank')"
        name="bankHolder"
        :rules="[{ required: true, message: $t('setting.noitiUseBank') }]"
      >
        <a-input
          v-model:value="formData.bankHolder"
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          class="form-input"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        class="mb-1 form-item"
        :label="$t('setting.imgae')"
        name="bankImage"
        :rules="[{ required: true, message: $t('setting.noitiUseBank') }]"
      >
        <a-upload
          accept="image/*"
          :showUploadList="false"
          :customRequest="uploadImage"
          :maxCount="1"
          list-type="picture"
          class="upload-list-inline"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            {{ $t("setting.dowloadImage") }}
          </a-button>
        </a-upload>
        <div class="mt-2">
          <a-image :height="100" :src="imagePath(formData.bankImage)" />
        </div>
      </a-form-item>
    </a-card> -->


    <a-card :title="$t('setting.cskh')">
      <a-form-item
        class="mb-1 form-item"
        :label="$t('setting.fanpage')"
        name="bankName"
      >
        <a-input v-model:value.trim="formData.fanpage" class="form-input !w-full">
        </a-input>
      </a-form-item>
    </a-card>
    <a-form-item class="mt-2">
      <a-button type="primary" html-type="submit">{{
        $t("setting.save")
      }}</a-button>
    </a-form-item>
  </a-form>
</template>

<style lang="scss" scoped>
.form-input {
  width: unset;
}

.nap-rut {
  .form-item {
    width: 300px;
    :deep(label) {
      width: 85px;
    }
  }
}

.bank {
  .form-item {
    // width: 300px;
    :deep(label) {
      width: 115px;
    }
  }
}

.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline :deep(.ant-upload-animate-enter) {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline :deep(.ant-upload-animate-leave) {
  animation-name: uploadAnimateInlineOut;
}
</style>
