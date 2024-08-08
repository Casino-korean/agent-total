<template>
  <a-card>
    <a-row :gutter="[16, 16]">
      <a-col :xs="{ span: 24 }" :lg="{ span: 8 }">
        <a-card>
          <h3>Phiên: # {{ panelData.seq }}</h3>
          <h3 v-if="panelData.isBet" style="color: green">
            Đặt: {{ String(panelData.timeGame).padStart(2, "0") }}
          </h3>
          <h3 v-else style="color: red">
            Chờ: {{ String(panelData.timeGameResult).padStart(2, "0") }}
          </h3>
        </a-card>
      </a-col>

      <a-col :xs="{ span: 24 }" :lg="{ span: 8 }">
        <a-card>
          <h3>Người chơi</h3>
          <a-row class="text-center">
            <a-col :span="12">
              <h3>{{ formatOrder(0) }}</h3>
              <h3>{{ formatNumber(panelData.totalUserTai) }}</h3>
              <h3>{{ formatNumber(panelData.totalBetTai) }}</h3>
            </a-col>
            <a-col :span="12">
              <h3>{{ formatOrder(1) }}</h3>
              <h3>{{ formatNumber(panelData.totalUserXiu) }}</h3>
              <h3>{{ formatNumber(panelData.totalBetXiu) }}</h3>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col :xs="{ span: 24 }" :lg="{ span: 8 }">
        <a-card>
          <h3>Kết quả</h3>
          <div
            v-for="(dice, index) in result.dices"
            :key="'dice-' + index"
            class="w-10 h-10 border-2 border-solid border-red-400 rounded-md inline-flex justify-center items-center font-bold mx-1 cursor-pointer"
            @click="showSettingsResultModal = true"
          >
            {{ dice }}
          </div>
        </a-card>
      </a-col>

      <a-modal
        title="Cài đặt kết quả"
        v-model:open="showSettingsResultModal"
        cancelText="Thoát"
      >
        <div
          v-for="(dice, index) in result.dices"
          :key="'settings-dice-' + index"
          class="mt-2"
        >
          <h3>Thứ: {{ index + 1 }}</h3>
          <TXSetDice @setDice="onSetDice" :dice="index" :active="dice" />
        </div>

        <div class="mt-2">
          <h3>Tổng:</h3>
          <a-button @click="settingSumDice(0)" type="primary">{{
            formatOrder(0)
          }}</a-button>
          <a-button class="mx-2" @click="settingSumDice(1)"
            >{{ formatOrder(1) }}
          </a-button>
        </div>
        <template #footer>
          <a-button key="back" @click="showSettingsResultModal = false"
            >Thoát</a-button
          >
        </template>
      </a-modal>
    </a-row>
  </a-card>

  <SettingsLogs :data="settingsLogsData" @fetchData="onFetchSettingLogs"/>
  
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useWebSocket } from "@vueuse/core";
import { formatNumber } from "@/helpers/format";
import TXSetDice from "./TXSetDice.vue";
import { notification } from "ant-design-vue";
import SettingsLogs from "@/components/Games/SettingsLogs.vue";
const BaseURL = import.meta.env.VITE_APP_GAME_SOCKET_1;

const socket = useWebSocket(BaseURL, {
  autoReconnect: true,
});

const panelData = reactive({
  timeGame: 0,
  timeGameResult: 0,
  isBet: true,
  seq: 0,
  totalUserTai: 0,
  totalUserXiu: 0,
  totalBetTai: 0,
  totalBetXiu: 0,
});

const showSettingsResultModal = ref(false);

const settingsLogsData = ref({
  data: [],
  total: 0
})

const result = reactive({
  dices: [0, 0, 0],
  sumDice: 0,
});

function onLogIn() {
  getSettingLogs();
}

function onDataGame(data) {
  Object.assign(panelData, data);
}

function onResult(data) {
  Object.assign(result, data);
}

function onSettings(d) {
  const { dices } = d;
  result.dices = dices;
}

function onSettingLogs(d) {
  settingsLogsData.value = d;
}

function getSettingLogs(d) {
  sendMessage({
    t: "getSettingLogs",
    d,
  });
}

function onFetchSettingLogs(e) {
  getSettingLogs(e)
}
function onMessage(d, ok) {
  const type = ok ? "success" : "error";
  notification[type]({
    title: "",
    message: d,
  });
}

function formatOrder(num) {
  switch (num) {
    case 0:
      return "Tài";
    case 1:
      return "Xỉu";
    default:
      return "N/A";
  }
}

function sendMessage(message) {
  socket.send(JSON.stringify(message));
}

function onSetDice(payload) {
  const { dice, value } = payload;
  const dices = result.dices.map((e) => e);
  dices[dice] = value;
  sendMessage({
    t: "settings",
    d: { dices: dices },
  });
}

function settingSumDice(value) {
  sendMessage({
    t: "settings",
    d: { sumDices: value },
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
    const { t, d, ok } = data;
    if (data.t === "login") {
      onLogIn(d);
    }
    if (data.t === "data_game") {
      onDataGame(d);
    }
    if (data.t === "result") {
      onResult(d);
    }

    if (data.t === "msg") {
      onMessage(d, ok);
    }

    if (data.t === "settings") {
      onSettings(d);
    }

    if (data.t === "getSettingLogs") {
      onSettingLogs(d);
    }
    if (data.t === "game-settings") {
      getSettingLogs();
    }
  }
);
</script>
<style lang="">
</style>