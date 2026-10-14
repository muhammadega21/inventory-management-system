export const ProductListSelect = {
  id: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  name: true,
  sku: true,
  unit: true,
  minimum_stock: true,
  image: true,
  is_active: true,
  createdAt: true,
} as const;

export const ProductDetailSelect = {
  ...ProductListSelect,
  description: true,
  updatedAt: true,

  stockMovements: {
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      quantity: true,
      quantity_before: true,
      quantity_after: true,
      createdAt: true,

      warehouse: {
        select: {
          id: true,
          name: true,
          code: true,
          city: true,
          is_active: true,
        },
      },

      stockTransaction: {
        select: {
          id: true,
          transaction_number: true,
          type: true,
          transaction_date: true,
          notes: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
} as const;
