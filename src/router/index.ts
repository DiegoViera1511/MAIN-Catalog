import { createRouter, createWebHistory } from 'vue-router';
import ProductInfo from "../views/ProductInfo.vue";
import Home from "../views/Home.vue";
import CartList from "../views/CartList.vue";
import ContactView from "@/views/ContactView.vue";

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