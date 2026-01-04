import { defineStore } from 'pinia'
import {type CartProduct, Colors, type ProductType, SpanishColors} from "../lib/types.ts";

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
        },
        getCartTotal: (state) => () => {
            return state.cart.reduce((sum, product) => sum + (product.discount_price ?? product.price) * product.quantity, 0);
        },
        getCartItemsCount: (state) => () => {
            return state.cart.reduce((sum, product) => sum + product.quantity, 0);
        },
        getCartInvoiceText: (state) => () => {
            const products = state.cart;
            const lines = products.map(product => {
                const lineTotal = ((product.discount_price ?? product.price) * product.quantity).toFixed(2);
                return `${product.title}%20${product.selectedSize ? '%0ATalla:%20' + product.selectedSize : ''}%20%0AColor:%20${SpanishColors[product.selectedColor as Colors]}%20%20%0ACantidad:%20${product.quantity}%20%0APrecio:%20$${lineTotal}%20%20%0A------------------------------`;
            });
            if (products.length > 0) {
                const total = state.cart.reduce((sum, product) => sum + (product.discount_price ?? product.price) * product.quantity, 0).toFixed(2);
                lines.push(`Total: $${total}%20`);
            }
            return lines.join('%0A');
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