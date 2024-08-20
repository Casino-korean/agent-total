<script setup>
import {defineProps, reactive, ref} from "vue";
import request from "@/request";
import api from "@/request/api";
import { notification } from "ant-design-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const showModal = ref(true);
const props = defineProps(["agents"]);
const emit = defineEmits(["close"]);

function closeModal() {
  emit("close");
}

const dataSubmit = reactive({
  username: "",
  password: "",
  role: 'agent',
  displayName: ""
});

// const banksList = ref([]);
const agentOptions = Array.from(props.agents).map((e) => {
  return {
    value: e.refCode,
    label: e.username
  }
})

const submitAddUser = async () => {
  try {
    const data = {};
    // if (!dataSubmit.uplineID) {
    //   notification.error({
    //     message: $t("Vui lòng chọn đại lý tổng"),
    //   });
    //   return;
    // }

    Object.keys(dataSubmit).forEach((k) => {
      if (dataSubmit[k] !== "") {
        data[k] = dataSubmit[k];
      }
    });
    const res = await request.post(api.USER_ADD, data);
    if (res.ok) {
      emit("updated");
      notification.success({
        message: $t("User.addUserSuc"),
      });
      closeModal();
    } else {
      notification.error({
        message: res.e ?? $t("User.updateUserEr"),
      });
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: error.e ?? $t("User.updateUserEr"),
    });
  }
};

</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="$t('User.addAgent')"
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
        :label="$t('User.userName')"
        name="username"
        :rules="[
          { required: true, message: $t('User.userName') },
          { min: 6, message: $t('User.userName') },
        ]"
      >
        <a-input
          :placeholder="$t('User.usernamePlace')"
          v-model:value.trim="dataSubmit.username"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('User.nickName')"
        name="displayName"
        :rules="[
          { required: true, message: $t('User.nickName') },
          { min: 4, message: $t('User.nickName') },
        ]"
      >
        <a-input
          :placeholder="$t('User.nicknamePlace')"
          v-model:value.trim="dataSubmit.displayName"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('User.pass')"
        name="password"
        :rules="[
          { required: true, message: $t('User.passErr') },
          { min: 6, message: $t('User.passErr') },
        ]"
      >
        <a-input-password
          :placeholder="$t('User.passPlace')"
          v-model:value="dataSubmit.password"
        >
        </a-input-password>
      </a-form-item>

<!--      <a-form-item-->
<!--        :label="$t('User.generalAgent')"-->
<!--        name="agent"-->
<!--      >-->
<!--        <a-select-->
<!--          :placeholder="$t('User.vipPlace')"-->
<!--          :options ="agentOptions"-->
<!--          v-model:value="dataSubmit.uplineID"-->
<!--        >-->
<!--        </a-select>-->
<!--      </a-form-item>-->

      <div class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">{{
          $t("User.destroy")
        }}</a-button>
        <a-button @click="submitAddUser" type="primary" html-type="submit">{{
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
</style>
