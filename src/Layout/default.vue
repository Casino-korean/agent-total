<script setup>
import Menu from "@components/Menu.vue";
import {
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons-vue";
import { useUserStore } from "@/store/user";
import { useRoute } from "vue-router";
import ChangePasswordAction from "@/components/Me/ChangPasswordAction.vue";
import { ref } from "vue";

import LanguageChange from "@/components/LanguageChange.vue";

const route = useRoute();
const userStore = useUserStore();

const isShowChangePasswordModal = ref(false);
const isShowMenu = ref(false);
const menuKey = ref("");
const handleMenuClick = ({ key }) => {
  if ("change-password" == key) {
    isShowChangePasswordModal.value = true;
  }
  if ("logout" == key) {
    userStore.logout();
    window.open(import.meta.env.VITE_APP_ADMIN_URL + "/logout", "_self");
  }
};

function onMenuKeyChange(e) {
  menuKey.value = e;
}
function goToTele() {
  window.open("https://t.me/kohdev", "_blank");
}
</script>

<template>
  <div class="relative flex">
    <Transition name="transitionMenu">
      <Menu
        v-show="isShowMenu"
        class="sm:!block pt-[17px]"
        @change-key="onMenuKeyChange"
      ></Menu>
    </Transition>
    <div class="page-content">
      <section class="header">
        <a-page-header class="w-full" style="padding: 10px">
          <template #title>
            <MenuFoldOutlined
              v-if="isShowMenu"
              class="inline sm:hidden"
              @click="isShowMenu = !isShowMenu"
            />
            <MenuUnfoldOutlined
              v-else
              class="inline sm:hidden"
              @click="isShowMenu = !isShowMenu"
            />
            {{ route.meta.title }}
          </template>
          <template #extra>
            <div style="width: 100px">
              <LanguageChange />
            </div>
            <a-dropdown>
              <a-avatar
                style="background-color: #87d068"
                class="cursor-pointer"
              >
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="change-password">
                    <LockOutlined />
                    {{ $t("changePass") }}
                  </a-menu-item>
                  <a-menu-item key="logout">
                    <LogoutOutlined />
                    {{ $t("Logout") }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-page-header>
      </section>
      <div class="main">
        <router-view :key="menuKey"></router-view>
      </div>
      <section class="footer">
        <span>Developer by</span>
        <span style="color: cornflowerblue" class="ml-1" @click="goToTele">@kodev</span>
      </section>
    </div>
  </div>

  <ChangePasswordAction
    v-if="isShowChangePasswordModal"
    @close="isShowChangePasswordModal = false"
  />
</template>

<style lang="scss" scoped>
.page-content {
  background: #eeeeee;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  .main {
    flex: 1;
    padding: 20px;
    // height: calc(100vh - 300px);
  }
  .header,
  .footer {
    color: #000000;
    display: flex;
    justify-content: center;

    background: white;
    padding: 10px;
  }
}

.transitionMenu-enter-active {
  animation: transitionMenuAnimation 0.5s;
}
.transitionMenu-leave-active {
  animation: transitionMenuAnimation 0.5s reverse;
}

@keyframes transitionMenuAnimation {
  0% {
    transform: translateX(-256px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.footer {
  font-size: 18px; /* Kích thước chữ */
  font-weight: bold; /* Độ đậm của chữ */
  cursor: pointer;
}
</style>
