export type ProductInventory = {
  id: number | null;
  quantity: number;
  warehouse: {
    id: number;
    name: string;
    code: string;
    city: string;
    address: string;
    is_active: boolean;
  };
};
