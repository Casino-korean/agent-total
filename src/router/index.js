import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/store/user";

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import("@/pages/LoginPage.vue"),
        meta: { redirectIfLoggedIn: true },
    },

    {
        path: '/',
        component: () => import("@/Layout/default.vue"),
        meta: { auth: true },
        children: [

            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import("@/pages/Dashboard.vue"),
                meta: {
                    // title: "Dashboard"
                }
            },

            {
                path: '/users',
                name: 'users',
                component: () => import("@/pages/Users.vue"),
                meta: {
                    // title: "Người dùng"
                    // title: "User"
                }
            },

            {
                path: '/giftcode-list',
                name: 'giftcode-list',
                component: () => import("@/components/GiftCode/GiftCode.vue"),
                meta: {
                    // title: "Giftcode"
                }
            },

            {
                path: '/giftcode-use-list',
                name: 'giftcode-use-list',
                component: () => import("@/components/GiftCodeHistory/index.vue"),
                meta: {
                    // title: "Giftcode History"
                }
            },

            {
                path: '/letterListNormal',
                name: 'letter-listNormal',
                component: () => import("@/components/Letter/ListNormalLetter.vue"),
                meta: {
                    // title: "Danh sách thư"
                    // title: "Mailing list"
                }
            },
            {
                path: '/general-agent',
                name: 'general-agent',
                component: () => import("@/pages/GeneralAgent/General.vue"),
                meta: {
                    // title: "Đại lý"
                    // title: "Agency"
                }
            },

            {
                path: '/agent',
                name: 'agent',
                component: () => import("@/pages/Agent/Agent.vue"),
                meta: {
                    // title: "Đại lý"
                    // title: "Agency"
                }
            },

            {
                path: '/userAgent',
                name: 'userAgent',
                component: () => import("@/pages/Agent/AgentUsers.vue"),
                meta: {
                    // title: "Đại lý"
                    // title: "Agency"
                }
            },

            {
                path: '/vipMember',
                name: 'vipMember',
                component: () => import("@/pages/MemberVip.vue"),
                meta: {
                    // title: "Đại lý"
                    // title: "Agency"
                }
            },

            {
                path: '/adminBank',
                name: 'adminBank',
                component: () => import("@/components/Bank/ListBank.vue"),
                meta: {
                    // title: "Danh sách Bank"
                    // title: "List of Banks"
                }
            },

            // {
            //     path: '/historyPay',
            //     name: 'historyPay',
            //     component: () => import("@/components/Bank/HistoryBank.vue"),
            //     meta: {
            //         title: "Danh sách chuyển tiền"
            //     }
            // },

            {
                path: '/deposit',
                name: 'transaction-deposit',
                component: () => import("@/pages/Transactions/Deposit.vue"),
                meta: {
                    // title: "Nạp tiền"
                    // title: "Deposit"
                }
            },

            {
                path: '/withdraw',
                name: 'transaction-withdraw',
                component: () => import("@/pages/Transactions/Withdraw.vue"),
                meta: {
                    // title: "Rút tiền"
                    // title: "Withdraw"
                }
            },

            {
                path: '/logtransaction',
                name: 'logtransaction',
                component: () => import("@/pages/Transactions/LogTransaction.vue"),
                meta: {
                    // title: "Chuyển tiền"
                    // title: "Transfer money"
                }
            },

            {
                path: '/logcommission',
                name: 'logcommission',
                component: () => import("@/pages/Transactions/LogCommission.vue"),
                meta: {
                    // title: "Chuyển tiền"
                    // title: "Transfer money"
                }
            },

            {
                path: '/vip-setting',
                name: 'vip-setting',
                component: () => import("@/pages/Settings/VipSetting.vue"),
                meta: {
                    // title: "Chuyển tiền"
                    // title: "Transfer money"
                }
            },

            {
                path: '/play-history',
                name: 'play-history',
                component: () => import("@/pages/PlayHistory.vue"),
                meta: {
                    // title: $t('LoginHistory.title')
                    // title: "Lịch sử đăng nhập"
                    // title: "Login history"
                }
            },

            {
                path: '/login-logs',
                name: 'login-logs',
                component: () => import("@/pages/LoginLogs.vue"),
                meta: {
                    // title: $t('LoginHistory.title')
                    // title: "Lịch sử đăng nhập"
                    // title: "Login history"
                }
            },

            // settigns
            // {
            //     path: '/settings-menu',
            //     name: 'settings-menu',
            //     component: () => import("@/pages/Settings/MenuSettings.vue"),
            //     meta: {
            //         title: "Cài đặt / Menu"
            //     }
            // },

            // {
            //     path: '/settings-home',
            //     name: 'settings-home',
            //     component: () => import("@/pages/Settings/HomeSettings.vue"),
            //     meta: {
            //         title: "Cài đặt / Trang chủ"
            //     }
            // },

            {
                path: '/settings-system',
                name: 'settings-system',
                component: () => import("@/pages/Settings/SystemSettings.vue"),
                // meta: {
                //     title: "Cài đặt / Hệ thống"
                // }
            },

            {
                path: '/settings-white-list',
                name: 'settings-white-list',
                component: () => import("@/pages/Settings/WhiteListSettings.vue"),
                meta: {
                    // title: "Cài đặt / White list"
                }
            },

            {
                path: '/settings-admin',
                name: 'settings-admin',
                component: () => import("@/pages/Settings/AdminSetting.vue"),
                meta: {
                    title: "Phân Loại Hậu Đài"
                }
            },


            {
                path: '/fanpage',
                name: 'fanpage',
                component: () => import("@/pages/Fanpage.vue"),
                meta: {}
            },

            {
                path: '/app-download',
                name: 'app-download',
                component: () => import("@/pages/AppDownload.vue"),
                meta: {}
            },

            {
                path: '/group',
                name: 'group',
                component: () => import("@/pages/Groups.vue"),
                meta: {}
            },

            {
                path: '/game-tx-normal',
                name: 'game-tx-normal',
                component: () => import("@/components/Games/TX/TXPanel.vue"),
                meta: {
                    // title: "Games / Tài xỉu thường"
                }
            },

            {
                path: '/game-tx-md5',
                name: 'game-tx-md5',
                component: () => import("@/components/Games/TX-md5/TXPanel.vue"),
                meta: {
                    // title: "Games / Tài xỉu md5"
                }
            },

            {
                path: '/game-rong-ho',
                name: 'game-rong-ho',
                component: () => import("@/components/Games/RongHo/RongHoPanel.vue"),
                meta: {
                    // title: "Games / Rồng Hổ"
                }
            },

            {
                path: '/game-xoc-dia',
                name: 'game-xoc-dia',
                component: () => import("@/components/Games/XocDia/XocDiaPanel.vue"),
                meta: {
                    // title: "Games / Xóc đĩa"
                }
            },

            {
                path: '/game-bau-cua',
                name: 'game-bau-cua',
                component: () => import("@/components/Games/BauCua/BauCuaPanel.vue"),
                meta: {
                    // title: "Games / Bầu Cua"
                }
            },

            {
                path: '/game-slot-money',
                name: 'game-slot-money',
                component: () => import("@/components/Games/SlotMoney/SlotMoneyPanel.vue"),
                meta: {
                    // title: "Games / Slot Money"
                }
            },

            {
                path: '/game-baccarat',
                name: 'game-baccarat',
                component: () => import("@/components/Games/Baccarat/BaccaratPanel.vue"),
                meta: {
                    // title: "Games / Baccarat"
                }
            },

            {
                path: '/game-xo-so-nhanh',
                name: 'game-xo-so-nhanh',
                component: () => import("@/components/Games/XoSoNhanh/XoSoNhanhPanel.vue"),
                meta: {
                    // title: "Games / Xổ số nhanh"
                }
            },

            {
                path: '/game-statistics',
                name: 'game-statistics',
                component: () => import("@/components/Games/GameStatistics/index.vue"),
                meta: {
                    // title: "Games / Thống kê trò chơi"
                }
            },

            {
                path: '/activity-center',
                name: 'activity-center',
                component: () => import("@/components/ActivityCenter/index.vue"),
                meta: {
                    // title: "Trung tâm hoạt động"
                }
            },

            {
                path: '/popup-prompt',
                name: 'popup-prompt',
                component: () => import("@/components/PopupPrompt/index.vue"),
                meta: {
                    // title: "Lời nhắc bật lên"
                }
            },
        ]
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'users' } }

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to, _, next) => {
    // console.log(to)
    const isLoggedIn = localStorage.getItem("accessToken");
    if (to.meta.redirectIfLoggedIn) { // ko yêu  cầu đang nhập
        if (isLoggedIn) return next("/");
    }
    else { // yêu  cầu đang nhập
        if (!isLoggedIn) return next("/login");
        else {
            const userStore = useUserStore();
            userStore.getUserInfo();
        }
    }
    return next();
});

export default router
