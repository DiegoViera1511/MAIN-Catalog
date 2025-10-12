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
    colors: string[]
}

export interface CartProduct {
    id:number,
    url:string,
    title:string,
    price:number,
    selectedSize: string,
    selectedColor: string,
    quantity: number,
}

export enum Colors {
    RED = "red",
    ORANGE = "orange",
    AMBER = "amber",
    YELLOW = "yellow",
    LIME = "lime",
    GREEN = "green",
    EMERALD = "emerald",
    TEAL = "teal",
    CYAN = "cyan",
    SKY = "sky",
    BLUE = "blue",
    INDIGO = "indigo",
    VIOLET = "violet",
    PURPLE = "purple",
    FUCHSIA = "fuchsia",
    ROSE = "rose",
    PINK = "pink",
    SLATE = "slate",
    GRAY = "gray",
    ZINC = "zinc",
    NEUTRAL = "neutral",
    STONE = "stone",
    BLACK = "black",
    WHITE = "white",
}

export const BgColors = {
    [Colors.RED] : "bg-red-500",
    [Colors.ORANGE] : "bg-orange-500",
    [Colors.AMBER] : "bg-amber-500",
    [Colors.YELLOW] : "bg-yellow-500",
    [Colors.LIME] : "bg-lime-500",
    [Colors.GREEN] : "bg-green-500",
    [Colors.EMERALD] : "bg-emerald-500",
    [Colors.TEAL] : "bg-teal-500",
    [Colors.CYAN] : "bg-cyan-500",
    [Colors.SKY] : "bg-sky-500",
    [Colors.BLUE] : "bg-blue-500",
    [Colors.INDIGO] : "bg-indigo-500",
    [Colors.VIOLET] : "bg-violet-500",
    [Colors.PURPLE] : "bg-purple-500",
    [Colors.FUCHSIA] : "bg-fuchsia-500",
    [Colors.PINK] : "bg-pink-500",
    [Colors.ROSE] : "bg-rose-500",
    [Colors.SLATE] : "bg-slate-500",
    [Colors.GRAY] : "bg-gray-500",
    [Colors.ZINC] : "bg-zinc-500",
    [Colors.NEUTRAL] : "bg-neutral-500",
    [Colors.STONE] : "bg-stone-500",
    [Colors.BLACK] : "bg-black",
    [Colors.WHITE] : "bg-white",
}