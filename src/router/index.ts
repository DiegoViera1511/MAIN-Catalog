import {createRouter, createWebHistory} from 'vue-router';
import ProductInfo from "../views/ProductInfo.vue";
import Home from "../views/Home.vue";
import CartList from "../views/CartList.vue";
import ContactView from "@/views/contacts/ContactView.vue";
import AdminLogIn from "@/views/admin/AdminLogIn.vue";
import AdminDashboard from "@/views/admin/dashboard/AdminDashboard.vue";
import NewProduct from "@/views/admin/NewProduct.vue";
import StockView from "@/views/admin/StockView.vue";
import EditProduct from '@/views/admin/EditProduct.vue';
import {Routes} from "@/lib/routes.ts";

const routes = [
    {
        path: Routes.HOME,
        component: Home,
        name: 'Home',
    },
    {
        path: Routes.MEN,
        component: Home,
        name: 'Men',
    },
    {
        path: Routes.WOMEN,
        component: Home,
        name: 'Women',
    },
    {
        path: Routes.ACCESSORIES,
        component: Home,
        name: 'Accessories',
    },
    {
        path: Routes.PRODUCT_INFO + ':id',
        component: ProductInfo,
        name: 'ProductInfo',
    },
    {
        path: Routes.CART,
        component: CartList,
        name: 'CartList',
    },
    {
        path: Routes.CONTACT,
        component: ContactView,
        name: 'Contact',
    },
    {
        path: Routes.ADMIN_LOGIN,
        component: AdminLogIn,
        name: 'AdminLogIn',
    },
    {
        path: Routes.ADMIN_DASHBOARD,
        component: AdminDashboard,
        name: 'AdminDashboard',
    },
    {
        path: Routes.ADMIN_NEW_PRODUCT,
        component: NewProduct,
        name: 'NewProduct',
    },
    {
        path: Routes.ADMIN_EDIT_PRODUCT + ':id',
        component: EditProduct,
        name: 'EditProduct',
    },
    {
        path: Routes.ADMIN_STOCK,
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