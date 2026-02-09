export interface Stock{
  _id?: string;
    name: string,
  image?: string,
  quantity: number,
  price: number,
  alartquantity?: number,
}


export interface postorder{
  log: order,
  newquality: number
}


export interface order{
  type: "Expenses" | "Income",
  value: number,
  description: string,
  Classification: string,
  productId: string
}