import { createRouter, createWebHistory } from 'vue-router';
import ProductInfo from "../components/ProductInfo.vue";
import Home from "../components/Home.vue";

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;