export enum Category {
    WOMEN = "WOMEN",
    MEN= "MEN",
    ACCESSORIES ="ACCESSORIES"
}

export interface ProductType {
    id:number,
    url:string,
    title:string,
    description:string,
    price:number,
    category: string[],
    sizes: string[],
    stock: number,
}

export interface CartProduct {
    id:number,
    url:string,
    title:string,
    price:number,
    selectedSize: string,
    quantity: number,
}