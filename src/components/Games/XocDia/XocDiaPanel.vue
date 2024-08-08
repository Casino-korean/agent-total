<template>
  <a-card>
    <a-row :gutter="[16, 16]">
      <a-col :xs="{ span: 24 }" :lg="{ span: 6 }">
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

      <a-col :xs="{ span: 24 }" :lg="{ span: 12 }">
        <a-card>
          <h3>Người chơi</h3>
          <a-row class="text-center">
            <a-col :span="8" v-for="(item, index) in orderSummary" :key="index">
              <h3>{{ formatOrder(item.type) }}</h3>
              <h3>{{ formatNumber(panelData[item.user]) }}</h3>
              <h3>{{ formatNumber(panelData[item.bet]) }}</h3>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col :xs="{ span: 24 }" :lg="{ span: 6 }">
        <a-card>
          <h3>Kết quả</h3>
          <div
            v-for="(dice, index) in result.dices"
            :key="'dice-' + index"
            class="w-10 h-10 border-2 border-solid rounded-md inline-flex justify-center items-center font-bold mx-1 cursor-pointer box-border"
            :class="{
              'border-red-400': dice % 2 === 1,
              'border-black': dice % 2 === 0,
            }"
            @click="showSettingsResultModal = true"
          >
            <div class="h-5 w-5 bg-red-500 rounded-full" v-if="dice % 2 === 1"></div>
            <div class="h-5 w-5 bg-black rounded-full border-4 flex justify-center items-center box-border" v-else>
              <div class="h-4 w-4 bg-white rounded-full"></div>
            </div>
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
          <XocDiaSetDice @setDice="onSetDice" :dice="index" :active="dice" />
        </div>

        <div class="mt-2">
          <h3>Tổng:</h3>
          <a-button @click="settingSumDice(item)" :type="index % 2 ? 'primary': 'default'" v-for="(item, index) in orderResult" :key="item" class="m-1">{{
            formatOrder(item)
          }}</a-button>
        </div>
        <template #footer>
          <a-button key="back" @click="showSettingsResultModal = false"
            >Thoát</a-button
          >
        </template>
      </a-modal>
    </a-row>
  </a-card>
  <SettingsLogs :data="settingsLogsData" @fetchData="onFetchSettingLogs" :formatValue="formatSetting"/>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useWebSocket } from "@vueuse/core";
import { formatNumber } from "@/helpers/format";
import XocDiaSetDice from "./XocDiaSetDice.vue";
import { notification } from "ant-design-vue";
import SettingsLogs from "@/components/Games/SettingsLogs.vue";

const BaseURL = import.meta.env.VITE_APP_GAME_SOCKET_4;

const socket = useWebSocket(BaseURL, {
  autoReconnect: true,
});

const panelData = reactive({
  timeGame: 0,
  timeGameResult: 0,
  isBet: true,
  seq: 0,

  totalUser : 0,
  totalUserOdd : 0,
  totalUserEven : 0,
  totalUser2Pair : 0,
  totalUser3Red : 0,
  totalUser4Red : 0,
  totalUser3White : 0,
  totalUser4White : 0,

  totalBetOdd : 0,
  totalBetEven : 0,
  totalBet2Pair : 0,
  totalBet3Red : 0,
  totalBet4Red : 0,
  totalBet3White : 0,
  totalBet4White : 0,
});

const showSettingsResultModal = ref(false);

const orderSummary = [
  { type: "odd", user: "totalUserOdd", bet: "totalBetOdd"},
  { type: "even", user: "totalUserEven", bet: "totalBetEven"},

  { type: "2_pair", user: "totalUser3Red", bet: "totalBet2Pair"},

  { type: "3_red", user: "totalUserOdd", bet: "totalBet3Red"},
  { type: "4_red", user: "totalUser4Red", bet: "totalBet4Red"},

  { type: "3_white", user: "totalUser3White", bet: "totalBet3White"},
  { type: "4_white", user: "totalUser4White", bet: "totalBet4White"},
]
const result = reactive({
  dices: [-1, -1, -1, -1],
  sumDice: 0,
});

const orderResult = ["odd", "even", "2_pair", "3_white", "4_white", "3_red", "4_red"]

const settingsLogsData = ref({
  data: [],
  total: 0
})

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
    case "odd":
      return "Lẻ";
    case "even":
      return "Chẵn";
    case "2_pair":
      return "Đôi";
    case "3_red":
      return "3 Đỏ";
    case "4_red":
      return "4 Đỏ";
    case "3_white":
      return "3 Trắng"
    case "4_white":
      return "4 Trắng"
    default:
      return "N/A";
  }
}

function formatSetting(settings) {
  const f = formatOrder(settings);
  if (f === "N/A") {
    let dicesHtml = "<div>";
    dicesHtml += settings.map((d) => {
      let dice = `<div class="w-7 h-7 border-2 inline-flex justify-center items-center font-bold mx-1 cursor-pointer box-border">`;
      dice +=
        d % 2
          ? `<div class="h-5 w-5 bg-red-500 rounded-full"></div>`
          : `<div class="h-5 w-5 bg-black rounded-full border-4 flex justify-center items-center box-border">
              <div class="h-4 w-4 bg-white rounded-full"></div>
            </div>`;
      dice += "</div>";
      return dice
    }).join("");
    dicesHtml += "</div>";
    return dicesHtml
  }
  return f;
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