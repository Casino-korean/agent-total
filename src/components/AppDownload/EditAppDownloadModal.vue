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

const props = defineProps({
  data: Object
});

const showModal = ref(true);
const emit = defineEmits(["close"]);

function closeModal() {
  emit("close");
}

const dataSubmit = reactive({
 name: props.data?.name ?? "",
 link: props.data?.link ?? "",
 show: props.data?.show ?? 1,
});


const onFinish = () => {
  console.log('onFinish')
  submit()
}
const submit = async () => {
  try {
    const res = await request.put(api.APP_DOWNLOAD + "/" + props.data._id, dataSubmit);
    if (res.ok) {
      emit("updated");
      notification.success({
        message: $t("app_download.edit_success"),
      });
      closeModal();
    } else {
      notification.error({
        message: res.e ?? $t("app_download.edit_error"),
      });
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: error.e ?? $t("app_download.edit_error"),
    });
  }
};
</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('app_download.edit_title')"
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
      @finish="onFinish"
    >
      <a-form-item
        :label="$t('app_download.name')"
        name="name"
        :rules="[{ required: true, message: $t('app_download.name_require') }]"
      >
        <a-input
          :placeholder="$t('app_download.name_placeholder')"
          v-model:value="dataSubmit.name"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('app_download.link')"
        name="link"
        :rules="[{ required: true, message: $t('app_download.link_require') }]"
      >
        <a-input
          :placeholder="$t('app_download.link_placeholder')"
          v-model:value="dataSubmit.link"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('app_download.show')"
        name="show"
      >
        <a-switch
          :placeholder="$t('app_download.link_placeholder')"
          v-model:value="dataSubmit.link"
          v-model:checked="dataSubmit.show" :checked-children="$t('app_download.show')" :un-checked-children="$t('app_download.hide')" :checkedValue="1" :unCheckedValue="0">
        </a-switch>
      </a-form-item>

      <div class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("app_download.cancel")
        }}</a-button>
        <a-button  type="primary" html-type="submit">{{
          $t("app_download.send")
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
</style>
