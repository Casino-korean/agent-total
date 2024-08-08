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
            <a-col
              :span="item.col ?? 8"
              v-for="(item, index) in orderSummary"
              :key="index"
            >
              <template v-if="!item.empty">
                <h3>{{ formatOrder(item.type) }}</h3>
                <h3>{{ formatNumber(panelData[item.user]) }}</h3>
                <h3>{{ formatNumber(panelData[item.bet]) }}</h3>
              </template>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col :xs="{ span: 24 }" :lg="{ span: 6 }">
        <a-card>
          <h3>Kết quả</h3>

          <a-row
            :gutter="[16, 16]"
            v-for="(item, index) in resultTable"
            :key="index"
          >
            <a-col>{{ item.label }}: </a-col>
            <a-col
              v-for="(r, idx) in result[item.key]"
              :key="item.key + '_' + idx"
              >{{ r }}</a-col
            >
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useWebSocket } from "@vueuse/core";
import { formatNumber } from "@/helpers/format";
import { notification } from "ant-design-vue";

const BaseURL = import.meta.env.VITE_APP_GAME_SOCKET_8;

const socket = useWebSocket(BaseURL, {
  autoReconnect: true,
});

const panelData = reactive({
  timeGame: 0,
  timeGameResult: 0,
  isBet: true,
  seq: 0,

  totalUser: 0,
});

const resultTable = [
  { key: "gdb", label: "Giải đặc biệt" },
  { key: "g1", label: "Giải nhất" },
  { key: "g2", label: "Giải nhì" },
  { key: "g3", label: "Giải ba" },
  { key: "g4", label: "Giải bốn" },
  { key: "g5", label: "Giải năm" },
  { key: "g6", label: "Giải sáu" },
  { key: "g7", label: "Giải bảy" },
];
const showSettingsResultModal = ref(false);

const orderSummary = [
  { type: "lo_2", user: "totalUserPlayer", bet: "totalBetPlayer", col: 8 },
  { type: "lo_3", user: "totalUserTie", bet: "totalBetTie", col: 8 },
  { type: "de_dau", user: "totalUserBanker", bet: "totalBetBanker", col: 8 },
  { type: "de_db", user: "totalUserBanker", bet: "totalBetBanker", col: 8 },
  { type: "3_cang", user: "totalUserBanker", bet: "totalBetBanker", col: 8 },
  { type: "xien_2", user: "totalUserBanker", bet: "totalBetBanker", col: 8 },
  { type: "xien_3", user: "totalUserBanker", bet: "totalBetBanker", col: 8 },
  { type: "xien_4", user: "totalUserBanker", bet: "totalBetBanker", col: 8 },
];

function defaultResut() {
  return {
    gdb: [],
    g1: [],
    g2: [],
    g3: [],
    g4: [],
    g5: [],
    g6: [],
    g7: [],
  };
}
const result = reactive({
  ...defaultResut()
});

function onDataGame(data) {
  Object.assign(panelData, data);
}

function onResult(data) {
  const r = {
    ...defaultResut(),
    ...data.result
  }
  Object.assign(result, r);
}

function onSettings(d) {
  const r = {
    ...defaultResut(),
    ...d.result
  }
  Object.assign(result, r);
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
    case "lo_2":
      return "Lô 2";
    case "lo_3":
      return "Lô 3";
    case "de_dau":
      return "Đề đầu";
    case "de_db":
      return "Đề đặc biệt";
    case "3_cang":
      return "3 Càng";
    case "xien_2":
      return "Xiên 2";
    case "xien_3":
      return "Xiên 3";
    case "xien_4":
      return "Xiên 4";
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