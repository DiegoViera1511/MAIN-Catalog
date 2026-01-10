export enum Routes {
  HOME = "/",
  MEN = "/men",
  WOMEN = "/women",
  ACCESSORIES = "/accessories",
  PRODUCT_INFO = "/product/", // + :id
  CART = "/cart",
  CONTACT = "/contact",
  ADMIN_LOGIN = "/admin/login",
  ADMIN_DASHBOARD = "/admin/dashboard",
  ADMIN_NEW_PRODUCT = "/admin/new-product",
  ADMIN_EDIT_PRODUCT = "/admin/stock/edit/", // + :id
  ADMIN_STOCK = "/admin/stock",
}

export enum SupaBaseRoutes {
  IMAGES = "public/images/", // + fileName
}
