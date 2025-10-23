import { createRouter, createWebHistory } from 'vue-router';
import ProductInfo from "../views/ProductInfo.vue";
import Home from "../views/Home.vue";
import CartList from "../views/CartList.vue";
import ContactView from "@/views/ContactView.vue";
import AdminLogIn from "@/views/AdminLogIn.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import NewProduct from "@/views/NewProduct.vue";
import StockView from "@/views/StockView.vue";

const routes = [
    {
        path: '/',
        component: Home,
        name: 'Home',
    },
    {
        path: '/men',
        component: Home,
        name: 'Man',
    },
    {
        path: '/women',
        component: Home,
        name: 'Women',
    },
    {
        path: '/accessories',
        component: Home,
        name: 'Accessories',
    },
    {
        path: '/product/:id',
        component: ProductInfo,
        name: 'ProductInfo',
    },
    {
        path: '/cart',
        component: CartList,
        name: 'CartList',
    },
    {
        path: '/contact',
        component: ContactView,
        name: 'Contact',
    },
    {
        path: '/admin/login',
        component: AdminLogIn,
        name: 'AdminLogIn',
    },
    {
        path: '/admin/dashboard',
        component: AdminDashboard,
        name: 'AdminDashboard',
    },
    {
        path: '/admin/new-product',
        component: NewProduct,
        name: 'NewProduct',
    },
    {
        path: '/admin/stock',
        component: StockView,
        name: 'StockView',
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            // Browser's back/forward button: use saved position
            return savedPosition
        } else {
            // Regular navigation: scroll to top
            return { top: 0 }
        }
    }
});

export default router;