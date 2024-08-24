<template>
  <div
    :style="{
      width: state.collapsed ? 'auto' : '256px',
      height: '100vh',
      background: '#001529',
      overflowY: 'scroll',
    }"
  >
    <a-button type="primary" class="mt-2 mb-2 ml-1" @click="toggleCollapsed">
      <MenuUnfoldOutlined v-if="state.collapsed" />
      <MenuFoldOutlined v-else />
    </a-button>

    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="state.collapsed"
      :items="items"
      @click="onClickMenu"
    ></a-menu>
  </div>
</template>
<script setup>
import { reactive, watch, h, onMounted } from "vue";
import { RouterLink, useLink, useRoute } from "vue-router";
import {
  UsergroupAddOutlined,
  HistoryOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TransactionOutlined,
  DashboardFilled,
  CodepenOutlined,
  UserAddOutlined,
  MessageOutlined,
  UserSwitchOutlined,
  DollarCircleOutlined,
  FacebookFilled,
  AndroidFilled,
  GoogleOutlined,
} from "@ant-design/icons-vue";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";

import { useI18n } from "vue-i18n";
const { t: $t } = useI18n({ useScope: "global" });

const route = useRoute();

const { userInfo } = storeToRefs(useUserStore());
const emit = defineEmits("change-key");
const state = reactive({
  collapsed: false,
  selectedKeys: [],
  openKeys: [],
});

const menuItems = [
  {
    key: "dashboard",
    icon: DashboardFilled,
    label: $t("Dashboard.title"),
    routeName: "dashboard",
  },
  // {
  //   key: "users",
  //   icon: UsergroupAddOutlined,
  //   label: $t("User.title"),
  //   routeName: "users",
  // },

  // {
  //   key: "cashFlow",
  //   icon: () => h(DollarCircleOutlined),
  //   label: "Quản lý dòng tiền",
  //   children: [
  //     {
  //       key: "historyPay",
  //       label: "Danh sách chuyển tiền",
  //       routeName: "historyPay",
  //     }
  //   ]
  // },

  // {
  //   key: "giftcode",
  //   icon: CodepenOutlined,
  //   label: $t("Giftcode.title"),
  //   routeName: "giftcode",
  // },

  // {
  //   key: "general-agent",
  //   icon: UserAddOutlined,
  //   label: $t("User.generalAgent"),
  //   routeName: "general-agent",
  // },

  {
    key: "agent",
    icon: () => h(UserAddOutlined),
    label: $t("User.manager"),
    children: [
      {
        key: "agent",
        label: $t("Partner.listAgent"),
        icon: () => h(UserAddOutlined),
        routeName: "agent",
      },
      {
        key: "userAgent",
        icon: UsergroupAddOutlined,
        label: $t("User.title"),
        routeName: "userAgent",
      },
      {
        key: "vipMember",
        icon: UserAddOutlined,
        label: $t("User.vipMember"),
        routeName: "vipMember",
      },
    ],
  },
  {
    key: "letter",
    icon: () => h(MessageOutlined),
    label: $t("Letter.title"),
    children: [
      {
        key: "letter-listNormal",
        label: $t("Letter.listLeter"),
        routeName: "letter-listNormal",
      },
    ],
  },

  // {
  //   key: "agent",
  //   icon: UsergroupAddOutlined,
  //   label: "Đại lý",
  //   routeName: "agent",
  // },

  {
    key: "transaction",
    icon: () => h(TransactionOutlined),
    label: $t("Transaction.title"),
    children: [
      {
        key: "transaction-deposit",
        label: $t("deposit"),
        routeName: "transaction-deposit",
      },
      {
        key: "transaction-withdraw",
        label: $t("widtdrwa"),
        routeName: "transaction-withdraw",
      },

      {
        key: "logtransaction",
        label: $t("log_transaction"),
        routeName: "logtransaction",
      },
      {
        key: "logcommission",
        label: $t("log_commission"),
        routeName: "logcommission",
      },
    ],
  },

  {
    key: "giftCodes",
    icon: () => h(TransactionOutlined),
    label: $t("Giftcode.title"),
    children: [
      // {
      //   key: "giftcode-list",
      //   label: $t("Giftcode.listGiftcode"),
      //   routeName: "giftcode-list",
      // },
      {
        key: "giftcode-use-list",
        label: $t("Giftcode.listUseGiftcode"),
        routeName: "giftcode-use-list",
      },
    ]
  },

  // {
  //   key: "login-logs",
  //   icon: UsergroupAddOutlined,
  //   label: $t("LoginHistory.title"),
  //   routeName: "login-logs",
  // },
  //     {
  //       key: "settings-admin",
  //       label: $t("settingAgent"),
  //       icon: () => h(TransactionOutlined),
  //       routeName: "settings-admin",
  //     },

  // {
  //   key: "settings",
  //   icon: () => h(TransactionOutlined),
  //   label: $t("setting.title"),
  //   children: [
  //     {
  //       key: "settings-white-list",
  //       label: $t("ip"),
  //       routeName: "settings-white-list",
  //     },
  //
  //     {
  //       key: "adminBank",
  //       label: $t("Bank.listBank"),
  //       routeName: "adminBank",
  //     },
  //
  //     {
  //       key: "settings-admin",
  //       label: $t("settingAgent"),
  //       routeName: "settings-admin",
  //     },
  //
  //     {
  //       key: "settings-system",
  //       label: "Hệ thống",
  //       routeName: "settings-system",
  //     },
  //     {
  //       key: "fanpage",
  //       icon: FacebookFilled,
  //       label: "Fanpage",
  //       routeName: "fanpage",
  //     },
  //
  //     {
  //       key: "app-download",
  //       icon: AndroidFilled,
  //       label: "App Download",
  //       routeName: "app-download",
  //     },
  //
  //     {
  //       key: "group",
  //       icon: GoogleOutlined,
  //       label: $t('group'),
  //       routeName: "group",
  //     },
  //     {
  //       key: "vip-setting",
  //       label: $t("setting.vip"),
  //       routeName: "vip-setting",
  //     },
  //   ],
  // },

  // {
  //   key: "play-hisotry",
  //   icon: HistoryOutlined,
  //   label: $t("playHistory"),
  //   routeName: "play-history",
  // },

  // {
  //   key: "activity-center",
  //   icon: HistoryOutlined,
  //   label: $t("activityCenter"),
  //   routeName: "activity-center",
  // },
  //
  // {
  //   key: "popup-prompt",
  //   icon: HistoryOutlined,
  //   label: $t("popupPrompt"),
  //   routeName: "popup-prompt",
  // },

  // {
  //   key: "games",
  //   icon: () => h(TransactionOutlined),
  //   label: "Game",
  //   children: [
  //     {
  //       key: "game-statistics",
  //       label: "Thống kê trò chơi",
  //       routeName: "game-statistics",
  //     },
  //     {
  //       key: "game-tx-normal",
  //       label: "Tài xỉu thường",
  //       routeName: "game-tx-normal",
  //     },
  //     {
  //       key: "game-tx-md5",
  //       label: "Tài xỉu md5",
  //       routeName: "game-tx-md5",
  //     },
  //     {
  //       key: "game-rong-ho",
  //       label: "Rổng Hổ",
  //       routeName: "game-rong-ho",
  //     },
  //     {
  //       key: "game-xoc-dia",
  //       label: "Xóc đĩa",
  //       routeName: "game-xoc-dia",
  //     },
  //     {
  //       key: "game-bau-cua",
  //       label: "Bầu Cua",
  //       routeName: "game-bau-cua",
  //     },
  //     {
  //       key: "game-slot-money",
  //       label: "Slot Money",
  //       routeName: "game-slot-money",
  //     },
  //     {
  //       key: "game-baccarat",
  //       label: "Baccarat",
  //       routeName: "game-baccarat",
  //     },
  //     {
  //       key: "game-xo-so-nhanh",
  //       label: "Xổ số nhanh",
  //       routeName: "game-xo-so-nhanh",
  //     },
  //   ],
  // },
];

function getMenuItem(item) {
  return item.routeName
    ? {
        key: item.key,
        icon: () => (item.icon ? h(item.icon) : null),
        label: h(
          RouterLink,
          { to: { name: item.routeName } },
          {
            default: () => item.label,
          }
        ),
      }
    : item;
}

const items = reactive(
  menuItems.map((item) => {
    if (item.children) {
      return {
        ...item,
        children: item.children.map((children) => getMenuItem(children)),
      };
    }
    return getMenuItem(item);
  })
);

function setMenuKeys(items, rootKey) {
  items.forEach((item) => {
    if (item.routeName == route.name) {
      state.selectedKeys.push(item.key);
      state.openKeys.push(rootKey || item.key);
      return;
    }
    if (item.children) return setMenuKeys(item.children, item.key);
  });
}

function onClickMenu(e) {
  emit("change-key", `item.key-${Date.now()}`);
}
onMounted(() => {
  setMenuKeys(menuItems);
});
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
</script>
