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
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(dice, index) in result.dices"
              :key="'dice-' + index"
              class="w-10 h-10 border-2 border-solid border-red-400 rounded-md flex justify-center items-center font-bold cursor-pointer box-border"
              @click="showSettingsResultModal = true"
            >
              {{ formatOrder(dice) }}
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
          <BauCuaSetDice @setDice="onSetDice" :dice="index" :active="dice" />
        </div>

        <!-- <div class="mt-2">
          <h3>Tổng:</h3>
          <a-button @click="settingSumDice(item)" :type="index % 2 ? 'primary': 'default'" v-for="(item, index) in orderResult" :key="item" class="m-1">{{
            formatOrder(item)
          }}</a-button>
        </div> -->
        <template #footer>
          <a-button key="back" @click="showSettingsResultModal = false"
            >Thoát</a-button
          >
        </template>
      </a-modal>
    </a-row>
  </a-card>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useWebSocket } from "@vueuse/core";
import { formatNumber } from "@/helpers/format";
import BauCuaSetDice from "./BauCuaSetDice.vue";
import { notification } from "ant-design-vue";

const BaseURL = import.meta.env.VITE_APP_GAME_SOCKET_5;

const socket = useWebSocket(BaseURL, {
  autoReconnect: true,
});

const panelData = reactive({
  timeGame: 0,
  timeGameResult: 0,
  isBet: true,
  seq: 0,

  totalUser: 0,

  totalUserBau: 0,
  totalUserCua: 0,
  totalUserCa: 0,
  totalUserGa: 0,
  totalUserTom: 0,
  totalUserNai: 0,

  totalBetBau: 0,
  totalBetCua: 0,
  totalBetCa: 0,
  totalBetGa: 0,
  totalBetTom: 0,
  totalBetNai: 0,
});

const showSettingsResultModal = ref(false);

const orderSummary = [
  { type: "bau", user: "totalUserBau", bet: "totalBetBau" },
  { type: "cua", user: "totalUserCua", bet: "totalBetCua" },

  { type: "ca", user: "totalUserCa", bet: "totalBetCa" },

  { type: "ga", user: "totalUserGa", bet: "totalBetGa" },
  { type: "tom", user: "totalUserTom", bet: "totalBetTom" },

  { type: "nai", user: "totalUserNai", bet: "totalBetNai" },
];
const result = reactive({
  dices: [0, 0, 0],
  sumDice: 0,
});

function onDataGame(data) {
  Object.assign(panelData, data);
}

function onResult(data) {
  result.dices = data.result;
}

function onSettings(d) {
  const { dices } = d;
  result.dices = dices;
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
    case "bau":
      return "Bầu";
    case "cua":
      return "Cua";
    case "ca":
      return "Cá";
    case "ga":
      return "Gà";
    case "tom":
      return "Tôm";
    case "nai":
      return "Nai";
    default:
      return "";
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
  }
);
</script>
<style lang="">
</style>