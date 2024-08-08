<template>
  <a-modal
    v-model:open="showModal"
    :title="props.type === 'create' ? $t('activity.add_title') : $t('activity.edit_title')"
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
        :label="$t('title')"
        name="title"
        :rules="[{ required: true, message: $t('activity.title_require') }]"
      >
        <a-input
          :placeholder="$t('activity.title_placeholder')"
          v-model:value="dataSubmit.title"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('activity.show')"
        name="show"
      >
        <a-switch
          v-model:value="dataSubmit.link"
          v-model:checked="dataSubmit.show" :checked-children="$t('activity.show')" :un-checked-children="$t('activity.hide')" :checkedValue="1" :unCheckedValue="0">
        </a-switch>
      </a-form-item>

      <div class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("activity.cancel")
        }}</a-button>
        <a-button  type="primary" html-type="submit">{{
          $t("activity.send")
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

<script setup>
import { reactive, ref, defineProps } from "vue";
import request from "@/request";
import api from "@/request/api";
import { notification } from "ant-design-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const props = defineProps(["type", "data"]);

const showModal = ref(true);
const emit = defineEmits(["updated", "close"]);

function closeModal() {
  emit("close");
}

const dataSubmit = reactive(
props.data ?
{...props.data} :  
{
 title: "",
 show: 1,
});


const onFinish = () => {
  console.log('onFinish')
  submit()
}
const submit = async () => {
  if(props.type === "create"){
    try {
      const res = await request.post(api.ADMIN_ACTIVITIES_CREATE, dataSubmit);
      if (res.ok) {
        emit("updated");
        notification.success({
          message: $t("activity.add_success"),
        });
        closeModal();
      } else {
        notification.error({
          message: res.e ?? $t("activity.add_error"),
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.e ?? $t("activity.add_error"),
      });
    }
  }

  else if(props.type === "update"){
    try {
      const res = await request.patch(api.ADMIN_ACTIVITIES_EDIT(props.data._id), {
        title: dataSubmit.title,
        show: dataSubmit.show,
      });
      if (res.ok) {
        emit("updated");
        notification.success({
          message: $t("activity.update_success"),
        });
        closeModal();
      } else {
        notification.error({
          message: res.e ?? $t("activity.update_error"),
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.e ?? $t("activity.update_error"),
      });
    }
  }

};
</script>
