import { defineStore } from 'pinia'
import type {CartProduct, ProductType} from "../types.ts";

interface ProductState {
    allProducts: ProductType[];
    cart: CartProduct[];
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
            return state.allProducts.filter(p => p.category.includes(category))
        }
    },
    actions: {
        addToCart(product: CartProduct) {
            const productInCart = this.cart.find(
                item => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor
            );
            if (productInCart) {
                productInCart.quantity += product.quantity;
            } else {
                this.cart.push(product);
            }
        },
        removeFromCart(id: number, selectedSize: string, selectedColor: string) {
            this.cart = this.cart.filter(item => !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor));
        },
        setProducts(products: ProductType[]) {
            this.allProducts = products
        }
    }
})