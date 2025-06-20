
import { supabase } from '@/lib/supabaseClient';
import { handleSupabaseError, handleSupabaseSuccess } from '@/contexts/data/utils';

export const fetchOrdersFromSupabase = async (profile, toast) => {
  if (!profile) return [];
  
  let query = supabase.from('orders').select(`
    *,
    profiles (id, full_name, email),
    order_items (
      *,
      products (id, name, image_url)
    )
  `).order('created_at', { ascending: false });

  if (profile.role === 'client') {
    query = query.eq('customer_id', profile.id);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError(error, "No se pudieron cargar los pedidos", toast);
    return [];
  }
  
  return data.map(o => ({
    id: o.id,
    customerId: o.customer_id,
    customerName: o.profiles?.full_name || 'Cliente Anónimo',
    customerEmail: o.profiles?.email || 'N/A',
    items: o.order_items.map(oi => ({
      id: oi.product_id, // This is product_id from order_items which refers to products.id
      name: oi.products?.name || 'Producto Desconocido',
      quantity: oi.quantity,
      price: oi.price_at_purchase,
      imageUrl: oi.products?.image_url
    })),
    total: parseFloat(o.total_amount),
    status: o.status,
    shippingAddress: o.shipping_address,
    createdAt: o.created_at,
    updatedAt: o.updated_at
  }));
};

export const createOrderInSupabase = async (userId, orderData, toast, onSuccess) => {
  if (!userId) {
    toast({ title: "Error", description: "Debes iniciar sesión para realizar un pedido.", variant: "destructive" });
    return null;
  }

  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert([{
      customer_id: userId,
      total_amount: orderData.total,
      status: 'pending',
      shipping_address: orderData.shippingAddress || {}
    }])
    .select()
    .single();

  if (orderError || !newOrder) {
    handleSupabaseError(orderError, "No se pudo crear el pedido", toast);
    return null;
  }

  const orderItemsData = orderData.items.map(item => ({
    order_id: newOrder.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.price
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);

  if (itemsError) {
    handleSupabaseError(itemsError, "No se pudieron agregar los productos al pedido. El pedido será cancelado.", toast);
    await supabase.from('orders').delete().eq('id', newOrder.id); // Rollback
    return null;
  }

  for (const item of orderData.items) {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.id)
      .single();

    if (productError || !product) {
      console.error(`Error fetching product ${item.id} for stock update:`, productError);
      continue; 
    }
    const newStock = product.stock - item.quantity;
    await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
  }
  
  handleSupabaseSuccess(`Tu pedido #${newOrder.id.substring(0,8)} ha sido procesado`, toast);
  if (onSuccess) {
    await onSuccess('orders');
    await onSuccess('products'); // For stock updates
  }
  return newOrder;
};

export const updateOrderStatusInSupabase = async (orderId, status, toast, onSuccess) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    handleSupabaseError(error, "No se pudo actualizar el estado del pedido", toast);
    return;
  }
  handleSupabaseSuccess(`El pedido #${orderId.substring(0,8)} se actualizó a ${status}`, toast);
  if (onSuccess) await onSuccess('orders');
};

export const getOrdersByCustomerFromSupabase = async (customerId, toast) => {
  if (!customerId) return [];
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (id, name, image_url)
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    handleSupabaseError(error, "Error al cargar pedidos del cliente", toast);
    return [];
  }
  return data.map(o => ({
    id: o.id,
    customerId: o.customer_id,
    items: o.order_items.map(oi => ({
      id: oi.product_id,
      name: oi.products?.name || 'Producto Desconocido',
      quantity: oi.quantity,
      price: oi.price_at_purchase,
      imageUrl: oi.products?.image_url
    })),
    total: parseFloat(o.total_amount),
    status: o.status,
    createdAt: o.created_at
  }));
};
