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
            <a-col :span="8">
              <h3>{{ formatOrder(0) }}</h3>
              <h3>{{ formatNumber(panelData.totalUserDragon) }}</h3>
              <h3>{{ formatNumber(panelData.totalBetDragon) }}</h3>
            </a-col>
            <a-col :span="8">
              <h3>{{ formatOrder(1) }}</h3>
              <h3>{{ formatNumber(panelData.totalUserTiger) }}</h3>
              <h3>{{ formatNumber(panelData.totalBetTiger) }}</h3>
            </a-col>
            <a-col :span="8">
              <h3>{{ formatOrder(2) }}</h3>
              <h3>{{ formatNumber(panelData.totalUserDragonEqalTiger) }}</h3>
              <h3>{{ formatNumber(panelData.totalBetDragonEqalTiger) }}</h3>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col :xs="{ span: 24 }" :lg="{ span: 8 }">
        <a-card>
          <h3>Kết quả</h3>
          <div
            v-for="item in ['dragon', 'tiger']"
            :key="'dice-' + item"
            class="inline-flex justify-center items-center"
            @click="showSettingsResultModal = true"
          >
            <div class="text-center">
              <div class="text-md font-bold">{{ formatName(item) }}</div>
              <div
                class="w-16 h-16 border-2 text-lg border-solid border-red-400 rounded-md font-bold mx-1 cursor-pointer flex justify-center items-center"
              >
                {{ cards[result?.resultOrder[item]?.score ?? 0] }}
                {{ result?.resultOrder[item]?.text }}
              </div>
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
          v-for="(item, index) in ['dragon', 'tiger']"
          :key="'settings-dice-' + index"
          class="mt-2"
        >
          <h3>{{ formatName(item) }}</h3>
          <RongHoSetCard
            @setDice="onSetDice"
            :dice="item"
            :active="result.resultOrder[item].score"
          />
        </div>

        <div class="mt-2">
          <h3>Rồng-Hổ-Hòa:</h3>
          <a-button @click="settingSumDice(0)" type="primary">{{
            formatOrder(0)
          }}</a-button>
          <a-button class="mx-2" @click="settingSumDice(1)"
            >{{ formatOrder(1) }}
          </a-button>
          <a-button class="mx-2" @click="settingSumDice(2)"
            >{{ formatOrder(2) }}
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
  <SettingsLogs :data="settingsLogsData" @fetchData="onFetchSettingLogs" :formatValue="formatSetting"/>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { useWebSocket } from "@vueuse/core";
import { formatNumber } from "@/helpers/format";
import RongHoSetCard from "./RongHoSetCard.vue";
import { notification } from "ant-design-vue";
import SettingsLogs from "@/components/Games/SettingsLogs.vue";

const BaseURL = import.meta.env.VITE_APP_GAME_SOCKET_3;

const socket = useWebSocket(BaseURL, {
  autoReconnect: true,
});

const panelData = reactive({
  timeGame: 0,
  timeGameResult: 0,
  isBet: true,
  seq: 0,
  totalUserDragon: 0,
  totalUserTiger: 0,
  totalUserDragonEqalTiger: 0,
  totalBetDragon: 0,
  totalBetTiger: 0,
  totalBetDragonEqalTiger: 0,
});

const showSettingsResultModal = ref(false);

const settingsLogsData = ref({
  data: [],
  total: 0
})

const result = reactive({
  resultOrder: {
    dragon: {
      score: 0, // Điểm lá bài
      text: "", // Tên lá bài
    },

    tiger: {
      score: 0, // Điểm lá bài
      text: "", // Tên lá bài
    },
  },
  resultWin: -1,
});

const cards = [
  "0",
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

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
  const { result: r } = d;
  if (r) {
    Object.assign(result.resultOrder, r);
  }
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
      return "Rồng";
    case 1:
      return "Hổ";
    case 2:
      return "Hòa";
    default:
      return "N/A";
  }
}

function formatName(num) {
  switch (num) {
    case "dragon":
      return "Rồng";
    case "tiger":
      return "Hổ";
    default:
      return "N/A";
  }
}

function formatSetting(settings) {
  return `<p>Rồng: ${settings.dragon.score} ${settings.dragon.text}</p>
          <p>Hổ: ${settings.tiger.score} ${settings.tiger.text}</p>
        `
}

function sendMessage(message) {
  socket.send(JSON.stringify(message));
}

function onSetDice(payload) {
  const { card, value } = payload;

  sendMessage({
    t: "settings",
    d: { [card]: value },
  });
}

function settingSumDice(value) {
  sendMessage({
    t: "settings",
    d: { result: value },
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