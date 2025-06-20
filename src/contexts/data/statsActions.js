
export const calculateStats = (orders, customers, products) => {
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  
  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
  };
};
