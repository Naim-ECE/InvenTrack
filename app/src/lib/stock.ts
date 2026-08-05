export const LOW_STOCK_THRESHOLD = 8;

export const getStockStatus = (stock: number) => {
  if (stock <= 0) return 'out';
  if (stock < LOW_STOCK_THRESHOLD) return 'low';
  return 'in';
};

export const getStockLabel = (stock: number) => {
  const status = getStockStatus(stock);
  if (status === 'out') return 'Out of Stock';
  if (status === 'low') return `Low Stock - ${stock} left`;
  return `In Stock - ${stock} available`;
};