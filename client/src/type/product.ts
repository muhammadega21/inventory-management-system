export type ProductList = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
  sku: string;
  unit: string;
  minimum_stock: number;
  image: string;
  is_active: boolean;
  createdAt: string;
};
