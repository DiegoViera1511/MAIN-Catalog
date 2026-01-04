import {supabase} from "@/lib/supabase.ts";
import type {ProductType} from "@/lib/types.ts";

export async function getProductsService(){
    try {
        let { data, error } = await supabase
            .from('product')
            .select('*')
            .order('created_at',{ascending: false})
        if (error) {
            console.log(error)
        }
        return data as ProductType[]
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getProductByIdService(id: number){
    try {
        const {data, error} = await supabase
            .from('product')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching product:', error);
            return;
        }
        return data as ProductType
    } catch (error) {
        console.error(error)
    }
}