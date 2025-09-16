import { createRouter, createWebHistory } from 'vue-router';
import ProductInfo from "../views/ProductInfo.vue";
import Home from "../views/Home.vue";
import CartList from "../views/CartList.vue";
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
        path: '/product/:id',
        component: ProductInfo,
        props: true,
        name: 'ProductInfo',
    },
    {
        path: '/cart',
        component: CartList,
        name: 'CartList',
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
    scrollBehavior() {
        return { top: 0 }
    }
});

export default router;