import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe ser usado dentro de DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);


  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
    if (error) {
      console.error("Error fetching categories:", error);
      toast({ title: "Error de Datos", description: "No se pudieron cargar las categorías.", variant: "destructive" });
      return [];
    }
    setCategories(data || []);
    return data || [];
  }, []);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from('products').select(`
      *,
      categories (id, name)
    `).order('name', { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
      toast({ title: "Error de Datos", description: "No se pudieron cargar los productos.", variant: "destructive" });
      return [];
    }
    const formattedProducts = (data || []).map(p => ({
      ...p,
      category: p.categories?.name || 'Sin categoría', 
      categoryId: p.category_id 
    }));
    setProducts(formattedProducts);
    return formattedProducts;
  }, []);
  
  const fetchOrders = useCallback(async () => {
    if (!profile) { // Depend on profile being loaded
      setOrders([]);
      return [];
    }
    
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
      console.error("Error fetching orders:", error);
      toast({ title: "Error de Datos", description: "No se pudieron cargar los pedidos.", variant: "destructive" });
      return [];
    }
    
    const formattedOrders = (data || []).map(o => ({
      id: o.id,
      customerId: o.customer_id,
      customerName: o.profiles?.full_name || 'Cliente Anónimo',
      customerEmail: o.profiles?.email || 'N/A',
      items: (o.order_items || []).map(oi => ({
        id: oi.product_id,
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
    setOrders(formattedOrders);
    return formattedOrders;
  }, [profile]);


  const fetchCustomers = useCallback(async () => {
    if (profile?.role !== 'admin') {
      setCustomers([]);
      return [];
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('full_name', { ascending: true });

    if (error) {
      console.error("Error fetching customers:", error);
      toast({ title: "Error de Datos", description: "No se pudieron cargar los clientes.", variant: "destructive" });
      return [];
    }
    setCustomers((data || []).map(c => ({
      id: c.id,
      name: c.full_name,
      email: c.email,
      createdAt: c.created_at,
    })));
    return data || [];
  }, [profile]);

  useEffect(() => {
    const loadAllData = async () => {
      if (initialDataLoaded) return; // Prevent re-fetching if already loaded
      
      setLoading(true);
      await fetchCategories();
      await fetchProducts();
      // Orders and customers depend on profile, which is handled by its own effect.
      // This ensures we don't fetch them prematurely if profile isn't ready.
      if (profile) {
        await fetchOrders();
        if (profile.role === 'admin') {
          await fetchCustomers();
        }
      }
      setLoading(false);
      setInitialDataLoaded(true); 
    };
    
    loadAllData();

  }, [profile, fetchCategories, fetchProducts, fetchOrders, fetchCustomers, initialDataLoaded]);

  // Effect to re-fetch orders/customers when profile changes (e.g., user logs in/out)
  useEffect(() => {
    if (profile) {
      setLoading(true);
      Promise.all([
        fetchOrders(),
        profile.role === 'admin' ? fetchCustomers() : Promise.resolve()
      ]).finally(() => setLoading(false));
    } else {
      // Clear orders and customers if no profile (e.g., user logged out)
      setOrders([]);
      setCustomers([]);
      setLoading(false); // Ensure loading is false if no profile
    }
  }, [profile, fetchOrders, fetchCustomers]);


  const addProduct = async (productData) => {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', productData.category)
      .single();

    let categoryIdToInsert = null;
    if (category) {
      categoryIdToInsert = category.id;
    } else if (productData.category) {
      const { data: newCategory, error: catError } = await supabase
        .from('categories')
        .insert({ name: productData.category, description: productData.category })
        .select('id')
        .single();
      if (catError || !newCategory) {
        toast({ title: "Error de Categoría", description: `No se pudo encontrar o crear la categoría ${productData.category}.`, variant: "destructive" });
        return null;
      }
      categoryIdToInsert = newCategory.id;
    } else {
       toast({ title: "Error de Categoría", description: `La categoría es obligatoria.`, variant: "destructive" });
       return null;
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category_id: categoryIdToInsert,
        stock: productData.stock,
        image_url: productData.imageUrl,
        featured: productData.featured,
        rating: productData.rating
      }])
      .select('*, categories(id, name)')
      .single();

    if (error) {
      console.error("Error adding product:", error);
      toast({ title: "Error de Producto", description: "No se pudo agregar el producto.", variant: "destructive" });
      return null;
    }
    await fetchProducts();
    toast({ title: "Producto Agregado", description: `${data.name} se agregó al catálogo.` });
    return data;
  };

  const updateProduct = async (productId, productData) => {
     const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', productData.category)
      .single();

    let categoryIdToUpdate = productData.categoryId;
    if (category) {
      categoryIdToUpdate = category.id;
    } else if (productData.category) {
       const { data: newCategory, error: catError } = await supabase
        .from('categories')
        .insert({ name: productData.category, description: productData.category })
        .select('id')
        .single();
      if (catError || !newCategory) {
        toast({ title: "Error de Categoría", description: `No se pudo encontrar o crear la categoría ${productData.category}.`, variant: "destructive" });
        return;
      }
      categoryIdToUpdate = newCategory.id;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category_id: categoryIdToUpdate,
        stock: productData.stock,
        image_url: productData.imageUrl,
        featured: productData.featured,
        rating: productData.rating
      })
      .eq('id', productId);

    if (error) {
      console.error("Error updating product:", error);
      toast({ title: "Error de Producto", description: "No se pudo actualizar el producto.", variant: "destructive" });
      return;
    }
    await fetchProducts();
    toast({ title: "Producto Actualizado", description: "Los cambios se guardaron correctamente." });
  };

  const deleteProduct = async (productId) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error("Error deleting product:", error);
      toast({ title: "Error de Producto", description: "No se pudo eliminar el producto. Puede estar asociado a pedidos.", variant: "destructive" });
      return;
    }
    await fetchProducts();
    toast({ title: "Producto Eliminado", description: "El producto se eliminó del catálogo." });
  };
  
  const addCategory = async (categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: categoryData.name, description: categoryData.description }])
      .select()
      .single();
    if (error) {
      console.error("Error adding category:", error);
      toast({ title: "Error de Categoría", description: "No se pudo agregar la categoría.", variant: "destructive" });
      return null;
    }
    await fetchCategories();
    toast({ title: "Categoría Agregada", description: `${data.name} se agregó a las categorías.` });
    return data;
  };

  const updateCategory = async (categoryId, categoryData) => {
    const { error } = await supabase
      .from('categories')
      .update({ name: categoryData.name, description: categoryData.description })
      .eq('id', categoryId);
    if (error) {
      console.error("Error updating category:", error);
      toast({ title: "Error de Categoría", description: "No se pudo actualizar la categoría.", variant: "destructive" });
      return;
    }
    await fetchCategories();
    toast({ title: "Categoría Actualizada", description: "Los cambios se guardaron correctamente." });
  };

  const deleteCategory = async (categoryId) => {
    const { data: productsInCategory, error: productCheckError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1);

    if (productCheckError) {
      console.error("Error checking products in category:", productCheckError);
      toast({ title: "Error", description: "Error al verificar productos en categoría.", variant: "destructive" });
      return;
    }

    if (productsInCategory && productsInCategory.length > 0) {
      toast({
        title: "Eliminación Bloqueada",
        description: `Esta categoría tiene productos asociados. Mueve o elimina los productos primero.`,
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase.from('categories').delete().eq('id', categoryId);
    if (error) {
      console.error("Error deleting category:", error);
      toast({ title: "Error de Categoría", description: "No se pudo eliminar la categoría.", variant: "destructive" });
      return;
    }
    await fetchCategories();
    toast({ title: "Categoría Eliminada", description: "La categoría se eliminó." });
  };

  const createOrder = async (orderData) => {
    if (!user) {
      toast({ title: "Acción Requerida", description: "Debes iniciar sesión para realizar un pedido.", variant: "destructive" });
      return null;
    }

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: user.id,
        total_amount: orderData.total,
        status: 'pending',
        shipping_address: orderData.shippingAddress || {}
      }])
      .select()
      .single();

    if (orderError || !newOrder) {
      console.error("Order creation error:", orderError);
      toast({ title: "Error de Pedido", description: "No se pudo crear el pedido.", variant: "destructive" });
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
      console.error("Order items creation error:", itemsError);
      toast({ title: "Error de Pedido", description: "No se pudieron agregar los productos al pedido. El pedido será cancelado.", variant: "destructive" });
      await supabase.from('orders').delete().eq('id', newOrder.id);
      return null;
    }

    for (const item of orderData.items) {
      const { data: productToUpdate, error: productError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single();

      if (productError || !productToUpdate) {
        console.error(`Error fetching product ${item.id} for stock update:`, productError);
        continue; 
      }
      const newStock = productToUpdate.stock - item.quantity;
      await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
    }
    
    await fetchOrders();
    await fetchProducts(); 
    toast({ title: "¡Pedido Realizado!", description: `Tu pedido #${newOrder.id.substring(0,8)} ha sido procesado.` });
    return newOrder;
  };

  const updateOrderStatus = async (orderId, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error("Error updating order status:", error);
      toast({ title: "Error de Pedido", description: "No se pudo actualizar el estado del pedido.", variant: "destructive" });
      return;
    }
    await fetchOrders();
    toast({ title: "Estado Actualizado", description: `El pedido #${orderId.substring(0,8)} se actualizó a ${status}.` });
  };

  const getOrdersByCustomer = useCallback(async (customerId) => {
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
      console.error("Error fetching customer orders:", error);
      return [];
    }
    return (data || []).map(o => ({
      id: o.id,
      customerId: o.customer_id,
      items: (o.order_items || []).map(oi => ({
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
  }, []);

  const getStats = useCallback(() => {
    const totalRevenue = orders.reduce((total, order) => total + parseFloat(order.total), 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalProducts = products.length;
    
    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    };
  }, [orders, customers, products]);

  const value = {
    products,
    orders,
    customers,
    categories,
    loading,
    setLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    createOrder,
    updateOrderStatus,
    getOrdersByCustomer,
    fetchProducts,
    fetchCategories,
    fetchOrders,
    fetchCustomers,
    getStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
