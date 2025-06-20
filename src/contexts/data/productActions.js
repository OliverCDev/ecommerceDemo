
import { supabase } from '@/lib/supabaseClient';
import { handleSupabaseError, handleSupabaseSuccess } from '@/contexts/data/utils';

export const fetchProductsFromSupabase = async (toast) => {
  const { data, error } = await supabase.from('products').select(`
    *,
    categories (id, name)
  `).order('name', { ascending: true });

  if (error) {
    handleSupabaseError(error, "No se pudieron cargar los productos", toast);
    return [];
  }
  return data.map(p => ({
    ...p,
    category: p.categories?.name || 'Sin categoría', 
    categoryId: p.category_id 
  }));
};

export const addProductToSupabase = async (productData, toast, onSuccess) => {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', productData.category)
    .single();

  let categoryIdToInsert = null;
  if (category) {
    categoryIdToInsert = category.id;
  } else {
    const { data: newCategory, error: catError } = await supabase
      .from('categories')
      .insert({ name: productData.category, description: productData.category })
      .select('id')
      .single();
    if (catError || !newCategory) {
      handleSupabaseError(catError, `No se pudo encontrar o crear la categoría ${productData.category}`, toast);
      return null;
    }
    categoryIdToInsert = newCategory.id;
    if (onSuccess) await onSuccess('categories'); // Indicate categories need refresh
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
    handleSupabaseError(error, "No se pudo agregar el producto", toast);
    return null;
  }
  handleSupabaseSuccess(`${data.name} se agregó al catálogo`, toast);
  if (onSuccess) await onSuccess('products');
  return data;
};

export const updateProductInSupabase = async (productId, productData, toast, onSuccess) => {
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
      handleSupabaseError(catError, `No se pudo encontrar o crear la categoría ${productData.category}`, toast);
      return;
    }
    categoryIdToUpdate = newCategory.id;
    if (onSuccess) await onSuccess('categories'); // Indicate categories need refresh
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
    handleSupabaseError(error, "No se pudo actualizar el producto", toast);
    return;
  }
  handleSupabaseSuccess("Los cambios se guardaron correctamente", toast);
  if (onSuccess) await onSuccess('products');
};

export const deleteProductFromSupabase = async (productId, toast, onSuccess) => {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) {
    handleSupabaseError(error, "No se pudo eliminar el producto", toast);
    return;
  }
  handleSupabaseSuccess("El producto se eliminó del catálogo", toast);
  if (onSuccess) await onSuccess('products');
};
