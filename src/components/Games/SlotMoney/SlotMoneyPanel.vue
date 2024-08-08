<template>
  <a-card>
    <a-row :gutter="[16, 16]">
      <a-col :xs="{ span: 24 }" :lg="{ span: 24 }">
        <a-card>
          <a-row
            v-for="(item, index) in settingsData.money_value_random"
            :key="index"
          >
            <a-col :span="24">
              Tỷ lệ trúng tờ {{ formatNumber(item.key.split("random_")[1]) }}
            </a-col>
            <a-col :span="12">
              <a-slider
                v-model:value="settingsData.money_value_random[index].value"
                :min="0"
                :max="100"
              />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model:value="settingsData.money_value_random[index].value"
                :min="0"
                :max="100"
                style="margin-left: 16px"
              />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <a-button type="primary" class="mt-4" @click="onSetingsBtnClick">Lưu</a-button>
  </a-card>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useWebSocket } from "@vueuse/core";
import { formatNumber } from "@/helpers/format";
import { notification } from "ant-design-vue";

const BaseURL = import.meta.env.VITE_APP_GAME_SOCKET_6;

const socket = useWebSocket(BaseURL, {
  autoReconnect: true,
});

const settingsData = reactive({
  money_precent_random: [],
  money_value_random: [],
});

function onSettings(ok, d, msg) {
  if(!ok) return
  Object.assign(settingsData, d);
  if(msg) {
    onMessage(msg, ok)
  }
}

function onMessage(d, ok) {
  const type = ok ? "success" : "error";
  notification[type]({
    title: "",
    message: d,
  });
}

function onLogin(d, ok) {
  if (ok) {
    sendMessage({
      t: "getSettings",
    });
  }
}
function sendMessage(message) {
  socket.send(JSON.stringify(message));
}

function onSetingsBtnClick() {
  sendMessage({
    t: "settings",
    d: settingsData
  });
}
sendMessage({
  t: "login",
  d: {
    token: localStorage.getItem("accessToken"),
  },
});

watch(
  () => socket.data.value,
  (mess) => {
    const data = JSON.parse(mess);
    const { t, d, ok, msg } = data;
    if (data.t === "login") {
      onLogin(d, ok);
    }

    if (data.t === "msg") {
      onMessage(d, ok);
    }

    if (data.t === "settings") {
      onSettings(ok, d, msg);
    }
  }
);
</script>
<style lang="">
</style>