import { createRouter, createWebHistory } from 'vue-router';
import ProductInfo from "../components/ProductInfo.vue";
import Home from "../components/Home.vue";
import CartList from "../components/CartList.vue";

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