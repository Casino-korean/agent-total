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
          <span class="font-bold">{{ formatOrder("player") }}</span>
          <span
            class="font-bold text-green-500 ml-2"
            v-if="result.winner === 'player'"
            >Thắng</span
          >

          <span
            class="font-bold text-orange-500 ml-2"
            v-else-if="result.winner === 'tie'"
            >Hòa</span
          >
          <div class="flex gap-2">
            <div
              v-for="(card, index) in result.cards.player"
              :key="'dice-' + index"
              :class="suitColor(card.suit)"
              class="w-16 h-20 border-2 border-solid border-current rounded-md flex justify-center items-center font-bold cursor-pointer box-border relative"
            >
              <div class="absolute top-0.5 right-0.5">{{ card.suit }}</div>
              <span class="text-2xl">{{ card.value }}</span>
            </div>
          </div>

          <span class="font-bold">{{ formatOrder("banker") }} </span>
          <span
            class="font-bold text-green-500 ml-2"
            v-if="result.winner === 'banker'"
            >Thắng</span
          >
          <span
            class="font-bold text-orange-500 ml-2"
            v-else-if="result.winner === 'tie'"
            >Hòa</span
          >
          <div class="flex gap-2">
            <div
              v-for="(card, index) in result.cards.banker"
              :key="'dice-' + index"
              :class="suitColor(card.suit)"
              class="w-16 h-20 border-2 border-solid border-current rounded-md flex justify-center items-center font-bold cursor-pointer box-border relative"
            >
              <div class="absolute top-0.5 right-0.5">{{ card.suit }}</div>
              <span class="text-2xl">{{ card.value }}</span>
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
          <!-- <BauCuaSetDice @setDice="onSetDice" :dice="index" :active="dice" /> -->
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
import { notification } from "ant-design-vue";

const BaseURL = import.meta.env.VITE_APP_GAME_SOCKET_7;

const socket = useWebSocket(BaseURL, {
  autoReconnect: true,
});

const panelData = reactive({
  timeGame: 0,
  timeGameResult: 0,
  isBet: true,
  seq: 0,

  totalUser: 0,

  totalUserPlayer: 0,
  totalUserBanker: 0,
  totalUserTie: 0,
  totalUserPlayerPair: 0,
  totalUserBankerPair: 0,
  totalUserLarge: 0,
  totalUserSmall: 0,

  totalBetPlayer: 0,
  totalBetBanker: 0,
  totalBetTie: 0,
  totalBetPlayerPair: 0,
  totalBetBankerPair: 0,
  totalBetLarge: 0,
  totalBetSmall: 0,
});

const showSettingsResultModal = ref(false);

const orderSummary = [
  { type: "player", user: "totalUserPlayer", bet: "totalBetPlayer", col: 8 },
  { type: "tie", user: "totalUserTie", bet: "totalBetTie", col: 8 },
  { type: "banker", user: "totalUserBanker", bet: "totalBetBanker", col: 8 },

  {
    type: "player_pair",
    user: "totalUserPlayerPair",
    bet: "totalBetPlayerPair",
    col: 8,
  },
  { type: "", user: "", bet: "", col: 8, empty: true },
  {
    type: "banker_pair",
    user: "totalUserBankerPair",
    bet: "totalBetBankerPair",
    col: 8,
  },

  { type: "large", user: "totalUserLarge", bet: "totalBetLarge", col: 8 },
  { type: "", user: "", bet: "", col: 8, empty: true },
  { type: "small", user: "totalUserSmall", bet: "totalBetSmall", col: 8 },
];
const result = reactive({
  cards: {
    player: [],
    banker: [],
  },
  winner: "",
  playerPair: 0,
  bankerPair: 0,
  largeSmall: 0,
});

function onDataGame(data) {
  Object.assign(panelData, data);
}

function onResult(data) {
  Object.assign(result, data);
}

function onSettings(d) {
  Object.assign(result, d);
}

function onMessage(d, ok) {
  const type = ok ? "success" : "error";
  notification[type]({
    title: "",
    message: d,
  });
}

function suitColor(suite) {
  switch (suite) {
    case "♦":
      return "text-red-600";
    case "♥":
      return "text-red-600";
    case "♣":
      return "text-black";
    case "♠":
      return "text-black";
    default:
      return "text-black";
  }
}

function formatOrder(num) {
  switch (num) {
    case "player":
      return "Nhà con";
    case "banker":
      return "Nhà cái";
    case "tie":
      return "Hòa";
    case "player_pair":
      return "Đôi nhà con";
    case "banker_pair":
      return "Đôi nhà cái";
    case "large":
      return "Lớn";
    case "small":
      return "Nhỏ";
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