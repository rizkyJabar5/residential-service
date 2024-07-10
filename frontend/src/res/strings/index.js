import moment from "moment-timezone";

export const strings = {
    today: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
    tomorrow: moment().add(1, 'days').tz("Asia/Jakarta").format("YYYY-MM-DD"),
    token: localStorage.getItem('token'),
    api: {
        host: "http://localhost:8080/api",
        HEADER_KEY: "mantapjiwa",
        JWT_KEY: "Aj1257Xi202",
    },
    image: {
        authBackground: 'url(/img/background.jpg)',
        logo: "/img/logo.png",
        logo2: "/img/logo-colored.png",
        favicon: "",
        primaryColor: "#1445e4",
        buttonColor: "#6e17f7",
        color1: "#0675b5",
        color2: "#10a8f0",
        color3: "#0077b6",
        color4: "#FF0000",
        color5: "#005578",
        color6: "#FFAA00"
    },
    auth_form: {
        isUnavailableAccount: "Belum punya akun? ",
        sign_up: "Daftar",
        sign_in: "Masuk",
        alreadyHaveAccount: "Sudah punya akun? ",
        create_account: "Create a new account:",
    },
    default: {
        title_app: "Kardiaq Dashboard",
    },
    navigation: {
        login: '/auth/login',
        register: '/auth/register',
        main: '/app',
        path: {
            login: 'login',
            register: 'register',
            forgot_password: 'forgot-password',
            activate: 'activate',
            resend: "resend",
            please: 'please',
            logout: "logout",
            dashboard: "/app/dashboard",

            citizen: {
                list: "/app/citizens",
                add: "/app/citizens/add",
            },

            letters: {
                list: "/app/letters",
                add: "/app/letters/add",
                // detail: "/app/letters/detail",
                edit: "/app/letters/edit",
                delete: "/app/letters/delete",
            },

            reports: {
                list: "/app/reports",
                add: "/app/reports/add",
            },
            finances: {
                list : "/app/finances",
                add: "/app/finances/add"
            },

            categories: "/app/categories",
            customers: "/app/customers",
            suppliers: "/app/suppliers",

	          news: {
							list: "/app/news",
	            add: "/app/info-news/add",
	            edit: "/app/info-news/edit",
	          },

            users: {
                list: "/app/users",
                add_staff: "/app/users/staff/add",
                add_citizen: "/app/users/citizen/add",
                edit_staff: "/app/users/staff/",
                edit_citizen: "/app/users/citizen",
                detail: "/app/users/detail",
                delete: "/app/users/delete",
            },

            detail_products: "/app/detail-product",
            invoice: "/app/invoice",
            detail_orders: "/app/detail-order",
            detail_reports: "/app/detail-report",
            detail_customers: "/app/detail-customer",
            detail_suppliers: "/app/detail-supplier",
            detail_expenses: "/app/detail-expense",
            detail_purchase: "/app/detail-purchase",
            detail_users: "/app/detail-user",
            profile: "/app/profile",
            settings: "/app/settings"
        }
    }
};
