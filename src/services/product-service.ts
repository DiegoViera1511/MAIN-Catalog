import { supabase } from "@/lib/supabase.ts";
import type { ProductType } from "@/lib/types.ts";

export async function getProductsService() {
  try {
    let { data, error } = await supabase
      .from("product")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.log(error);
    }
    return data as ProductType[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getProductByIdService(id: number) {
  try {
    const { data, error } = await supabase
      .from("product")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }
    return data as ProductType;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function uploadProductImageService(
  filePath: string,
  imageData: File,
) {
  try {
    const { error: uploadError } = await supabase.storage
      .from("Products")
      .upload(filePath, imageData);
    if (uploadError) {
      console.error("Error al subir imagen:", uploadError);
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getImagePublicUrlService(filePath: string) {
  try {
    const { data } = supabase.storage.from("Products").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error(error);
  }
}

export async function updateProductService(
  productId: number,
  updatedProduct: ProductType,
) {
  try {
    const { error: insertError } = await supabase
      .from("product")
      .update([
        {
          title: updatedProduct.title,
          description: updatedProduct.description,
          images: updatedProduct.images, // All images
          url: updatedProduct.url, // Primary image
          price: updatedProduct.price,
          discount_price: updatedProduct.discount_price,
          category: updatedProduct.category,
          sizes: updatedProduct.sizes,
          stock: 0, //TODO
          colors: updatedProduct.colors,
          available: updatedProduct.available,
        },
      ])
      .eq("id", productId);
    if (insertError) {
      console.error("Error updating product:", insertError);
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteUploadedImagesService(
  uploadedFilesPaths: string[],
) {
  try {
    if (uploadedFilesPaths.length > 0) {
      const relativePaths = uploadedFilesPaths.map((path) => {
        if (path.includes("/Products/")) {
          return path.split("/Products/")[1];
        }
        return path;
      });
      const { error } = await supabase.storage
        .from("Products")
        .remove(relativePaths);
      if (error) {
        console.error("Error deleting images:", error);
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createProductService(
  productTitle: string,
  productDescription: string,
  productImages: string[],
  productUrl: string,
  productPrice: number,
  productCategory: string[],
  productSizes: string[],
  productStock: number,
  productColors: string[],
  productAvailable: boolean,
) {
  try {
    const { error: insertError } = await supabase.from("product").insert([
      {
        title: productTitle,
        description: productDescription,
        images: productImages,
        url: productUrl,
        price: productPrice,
        category: productCategory,
        sizes: productSizes,
        stock: productStock,
        colors: productColors,
        available: productAvailable,
      },
    ]);
    if (insertError) {
      console.error("Error creating product:", insertError);
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteProductByIdService(
  productId: number,
  productImages: string[],
) {
  try {
    const { error } = await supabase
      .from("product")
      .delete()
      .eq("id", productId);
    if (error) {
      console.error("Error deleting product:", error);
      return false;
    }
    const deleteImagesResult = await deleteUploadedImagesService(productImages);
    if (!deleteImagesResult) {
      console.error("Error deleting product images");
      //TODO handle error
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
