export enum Category {
    WOMEN = "WOMEN",
    MEN= "MEN",
    ACCESSORIES ="ACCESSORIES"
}

export interface ProductType {
    url:string,
    title:string,
    description:string,
    price:number,
    category:Category
}