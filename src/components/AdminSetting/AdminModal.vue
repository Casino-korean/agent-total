<script setup>
import { reactive, computed, ref, defineProps } from "vue";
import request, { handleRequest } from "@/request";
import api from "@/request/api";
import { formatNumber, formatDateTime } from "@/helpers/format";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import { notification } from "ant-design-vue";

const showModal = ref(true);

const props = defineProps(["data", "type"]);

const title = computed(() => {
  return props.type === "create" ? "Thêm mới CSKH" : "Chỉnh sửa CSKH";
});

const emit = defineEmits(["close"]);

function closeModal() {
  emit("close");
}

const dataSubmit = reactive({
  username: props.data?.username ?? "",
  displayName: props.data?.displayName ?? "",
  password: "",
  role: props.data?.role ?? "agent",
  cskh: {
    tele: {
      isDisabled: props.data?.cskh?.tele.isDisabled ?? 0,
      linkcskh: props.data?.cskh?.tele.linkcskh ?? '',
    },
    livechat: {
      isDisabled: props.data?.cskh?.livechat.isDisabled ?? 0,
      linkcskh: props.data?.cskh?.livechat.linkcskh ?? '',
    },
    facebook: {
      isDisabled: props.data?.cskh?.facebook.isDisabled ?? 0,
      linkcskh: props.data?.cskh?.facebook.linkcskh ?? '',
    }
  },
  isDisabled: props.data?.isDisabled ?? 0
});

const fileList = ref([]);


// if (props.data?.image) {
//   fileList.value.push({
//     uid: "-1",
//     name: props.data.image,
//     url: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.image,
//     thumbUrl: import.meta.env.VITE_APP_CDN_URL + "/" + props.data.image,
//   });
// }


const submitEdit = () => {
  const { role, displayName, ...dataSave} = dataSubmit
  handleRequest(request.patch(api.AGENT_CHANGE + "/" + props.data._id, dataSave), (res) => {
    emit("close")
    emit("updated")
  }, "Cập nhật thành công.");
};


const submitCreate = () => {
    if (!dataSubmit.password) {
    notification.error({
      message: "Vui lòng nhập mật khẩu",
      duration: 3
    });
    return;
  }
  const { isDisabled, ...dataSave} = dataSubmit
  dataSave.vip = 0
  handleRequest(request.post(api.AGENT_CHANGE, dataSave), (res) => {
    emit("close")
    emit("updated")
  }, "Tạo mới CSKH thành công.");
};

const submitForm = () => {
  if (props.type === "create") {
    submitCreate();
  } else {
    submitEdit();
  }
};

</script>

<template>
  <a-modal
    v-model:open="showModal"
    :title="title"
    :onCancel="closeModal"
    :footer="null"
  >
    <a-form
      ref="createAccountForm"
      :model="dataSubmit"
      name="horizontal_login"
      autocomplete="off"
      :label-col="{ span: 7 }"
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
      >
        <a-input-password
          :placeholder="$t('User.passPlace')"
          v-model:value="dataSubmit.password"
        >
        </a-input-password>
      </a-form-item>
      <a-form-item
        :label="$t('User.cskhType1')"
        name="cskhType1"
      >
        <a-input
          :disabled="true"
          :placeholder="$t('User.cskhType1')"
          value="TELEGRAM"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('User.cskhLink1')"
        name="cskhLink"
      >
        <a-input
          v-model:value.trim="dataSubmit.cskh.tele.linkcskh"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('User.cskhActive1')"
        name="cskhActive1"
      >
        <a-switch
            v-model:value="dataSubmit.cskh.tele.isDisabled"
            v-model:checked="dataSubmit.cskh.tele.isDisabled" :checked-children="$t('turnOn')" :un-checked-children="$t('turnOff')" :checkedValue="0" :unCheckedValue="1"
          >
        </a-switch>
      </a-form-item>

      <a-form-item
        :label="$t('User.cskhType2')"
        name="cskhType2"
      >
        <a-input
          :disabled="true"
          :placeholder="$t('User.cskhType2')"
          value="MEIQIA"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('User.cskhLink2')"
        name="cskhLink2"
      >
        <a-input
          v-model:value.trim="dataSubmit.cskh.livechat.linkcskh"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('User.cskhActive2')"
        name="cskhActive2"
      >
        <a-switch
            v-model:value="dataSubmit.cskh.livechat.isDisabled"
            v-model:checked="dataSubmit.cskh.livechat.isDisabled" :checked-children="$t('turnOn')" :un-checked-children="$t('turnOff')" :checkedValue="0" :unCheckedValue="1"
          >
        </a-switch>
      </a-form-item>

      <a-form-item
        :label="$t('User.cskhType3')"
        name="cskhType3"
      >
        <a-input
          :disabled="true"
          :placeholder="$t('User.cskhType3')"
          value="FACEBOOK"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        :label="$t('User.cskhLink3')"
        name="cskhLink3"
      >
        <a-input
          v-model:value.trim="dataSubmit.cskh.facebook.linkcskh"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('User.cskhActive3')"
        name="cskhActive3"
      >
        <a-switch
            v-model:value="dataSubmit.cskh.facebook.isDisabled"
            v-model:checked="dataSubmit.cskh.facebook.isDisabled" :checked-children="$t('turnOn')" :un-checked-children="$t('turnOff')" :checkedValue="0" :unCheckedValue="1"
          >
        </a-switch>
      </a-form-item>

<!--      <a-form-item-->
<!--        :label="$t('User.typeUser')"-->
<!--        name="typeUser"-->
<!--      >-->
<!--        <a-input-->
<!--          :disabled="true"-->
<!--          v-model:value.trim="dataSubmit.role"-->
<!--        >-->
<!--        </a-input>-->
<!--      </a-form-item>-->

      <a-form-item class="flex justify-end">
        <a-button @click="closeModal" class="mr-2">Hủy</a-button>
        <a-button @click="submitForm" type="primary" html-type="submit"
          >Gửi</a-button
        >
      </a-form-item>
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
