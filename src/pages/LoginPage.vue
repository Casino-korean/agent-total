<script setup>
import { onMounted, reactive } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import api from "@/request/api";
import request, { handleRequest } from "@/request";
import { useRouter, useRoute } from "vue-router";
import LanguageChange from "@/components/LanguageChange.vue";
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const router = useRouter();
const route = useRoute();

const formState = reactive({
  username: "",
  password: "",
});

const onFinish = async (values) => {
  handleRequest(
    request.post(api.AUTH_LOGIN, formState),
    (res) => {
      localStorage.setItem("accessToken", res.d.accessToken);
      router.push("/agent");
    },
    $t("Login.noiti_succes")
  );
};

onMounted(() => {
  const { token } = route.query
  if (token) {
    localStorage.setItem("accessToken", token);
    router.push("/")
  }
});
</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen">
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      class="w-full sm:max-w-md py-32 px-5 rounded pb-0"
    >
      <a-form-item
        name="username"
        :rules="[{ required: true, message: $t('Login.account_error') }]"
      >
        <a-input
          v-model:value="formState.username"
          :placeholder="$t('Login.acount_placeholder')"
        >
          <template #prefix
            ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[{ required: true, message: $t('Login.password_error') }]"
      >
        <a-input-password
          v-model:value="formState.password"
          :placeholder="$t('Login.password')"
        >
          <template #prefix
            ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input-password>
      </a-form-item>
      <div class="pb-5">
        <LanguageChange />
      </div>
      <a-form-item>
        <a-button type="primary" class="w-full" html-type="submit">{{
          $t("Login.btnLog")
        }}</a-button>
      </a-form-item>
      <div></div>
    </a-form>
  </div>
</template>

<style lang="scss" scoped></style>
