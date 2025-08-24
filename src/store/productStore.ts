import { defineStore } from 'pinia'
import type {ProductType} from "../types.ts";

interface ProductState {
    allProducts: ProductType[];
    cart: ProductType[];
}

export const useProductStore = defineStore('products', {
    state: (): ProductState => ({
        allProducts: [],
        cart: []
    }),
    getters: {
        getProductById: (state) => (id: number) => {
            return state.allProducts.find(p => p.id === id)
        },
        productsByCategory: (state) => (category: string) => {
            return state.allProducts.filter(p => p.category === category)
        }
    },
    actions: {
        addToCart(product: ProductType) {
            this.cart.push(product)
        },
        removeFromCart(id: number) {
            this.cart = this.cart.filter(item => item.id !== id)
        },
        setProducts(products: ProductType[]) {
            this.allProducts = products
        }
    }
})