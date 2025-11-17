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

  /* ==========================================================
     FETCH FUNCTIONS
  =========================================================== */

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

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

    const formatted = (data || []).map(p => ({
      ...p,
      category: p.categories?.name || 'Sin categoría',
      categoryId: p.category_id
    }));

    setProducts(formatted);
    return formatted;
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!profile) return [];

    let query = supabase.from('orders').select(`
      *,
      profiles (id, full_name, email),
      order_items (*, products (id, name, image_url))
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

    const formatted = (data || []).map(o => ({
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

    setOrders(formatted);
    return formatted;
  }, [profile]);

  const fetchCustomers = useCallback(async () => {
    if (profile?.role !== 'admin') return [];

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

    const formatted = (data || []).map(c => ({
      id: c.id,
      name: c.full_name,
      email: c.email,
      createdAt: c.created_at,
    }));

    setCustomers(formatted);
    return formatted;
  }, [profile]);

  /* ==========================================================
     FIX PRINCIPAL — SOLO CARGA DATOS UNA VEZ POR SESIÓN
  =========================================================== */

  useEffect(() => {
  const load = async () => {
    if (initialDataLoaded) return;

    setLoading(true);

    // Siempre cargamos categorías y productos (modo público)
    await Promise.all([fetchCategories(), fetchProducts()]);

    // Si hay perfil, cargamos datos privados
    if (profile) {
      await fetchOrders();
      if (profile.role === 'admin') {
        await fetchCustomers();
      }
    }

    setInitialDataLoaded(true);
    setLoading(false);
  };

  load();
}, [profile, initialDataLoaded, fetchCategories, fetchProducts, fetchOrders, fetchCustomers]);

  /* ==========================================================
     CRUDs (Productos, Categorías, Pedidos)
  =========================================================== */

  const addProduct = async (productData) => {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', productData.category)
      .single();

    let categoryIdToInsert = category?.id;

    if (!category) {
      const { data: newCat, error: catError } = await supabase
        .from('categories')
        .insert({ name: productData.category, description: productData.category })
        .select('id')
        .single();

      if (catError || !newCat) {
        toast({ title: "Error", description: "No se pudo crear la categoría.", variant: "destructive" });
        return null;
      }
      categoryIdToInsert = newCat.id;
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
      .select()
      .single();

    if (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo agregar el producto.", variant: "destructive" });
      return null;
    }

    await fetchProducts();
    return data;
  };

  const updateProduct = async (productId, productData) => {
    let categoryId = productData.categoryId;

    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', productData.category)
      .single();

    if (category) {
      categoryId = category.id;
    } else {
      const { data: newCat } = await supabase
        .from('categories')
        .insert({ name: productData.category, description: productData.category })
        .select('id')
        .single();

      if (newCat) categoryId = newCat.id;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category_id: categoryId,
        stock: productData.stock,
        image_url: productData.imageUrl,
        featured: productData.featured,
        rating: productData.rating
      })
      .eq('id', productId);

    if (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo actualizar.", variant: "destructive" });
      return;
    }

    await fetchProducts();
  };

  const deleteProduct = async (productId) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      toast({ title: "Error", description: "No se pudo eliminar.", variant: "destructive" });
      return;
    }
    await fetchProducts();
  };

  const addCategory = async (categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: categoryData.name, description: categoryData.description }])
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "No se pudo agregar la categoría.", variant: "destructive" });
      return null;
    }

    await fetchCategories();
    return data;
  };

  const updateCategory = async (categoryId, categoryData) => {
    const { error } = await supabase
      .from('categories')
      .update({ name: categoryData.name, description: categoryData.description })
      .eq('id', categoryId);

    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar.", variant: "destructive" });
      return;
    }

    await fetchCategories();
  };

  const deleteCategory = async (categoryId) => {
    const { data: productsInCategory } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1);

    if (productsInCategory?.length > 0) {
      toast({ title: "Error", description: "La categoría tiene productos asociados.", variant: "destructive" });
      return;
    }

    await supabase.from('categories').delete().eq('id', categoryId);
    await fetchCategories();
  };

  const createOrder = async (orderData) => {
    if (!user) {
      toast({ title: "Acción Requerida", description: "Debes iniciar sesión.", variant: "destructive" });
      return null;
    }

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: user.id,
        total_amount: orderData.total,
        status: 'pending',
        shipping_address: orderData.shippingAddress
      }])
      .select()
      .single();

    if (orderError) return null;

    const itemsToInsert = orderData.items.map(item => ({
      order_id: newOrder.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price
    }));

    await supabase.from('order_items').insert(itemsToInsert);
    await fetchOrders();
    return newOrder;
  };

  const updateOrderStatus = async (orderId, status) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    await fetchOrders();
  };

  const getOrdersByCustomer = useCallback(async (customerId) => {
    if (!customerId) return [];
    const { data } = await supabase.from('orders').select(`
      *,
      order_items (*, products (id, name, image_url))
    `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    return (data || []).map(o => ({
      id: o.id,
      customerId: o.customer_id,
      items: (o.order_items || []).map(oi => ({
        id: oi.product_id,
        name: oi.products?.name || 'Producto',
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
    return {
      totalRevenue: orders.reduce((t, o) => t + parseFloat(o.total), 0),
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalProducts: products.length
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