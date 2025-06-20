
import { supabase } from '@/lib/supabaseClient';
import { handleSupabaseError, handleSupabaseSuccess } from '@/contexts/data/utils';

export const fetchCategoriesFromSupabase = async (toast) => {
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
  if (error) {
    handleSupabaseError(error, "No se pudieron cargar las categorías", toast);
    return [];
  }
  return data;
};

export const addCategoryToSupabase = async (categoryData, toast, onSuccess) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: categoryData.name, description: categoryData.description }])
    .select()
    .single();
  if (error) {
    handleSupabaseError(error, "No se pudo agregar la categoría", toast);
    return null;
  }
  handleSupabaseSuccess(`${data.name} se agregó a las categorías`, toast);
  if (onSuccess) await onSuccess();
  return data;
};

export const updateCategoryInSupabase = async (categoryId, categoryData, toast, onSuccess) => {
  const { error } = await supabase
    .from('categories')
    .update({ name: categoryData.name, description: categoryData.description })
    .eq('id', categoryId);
  if (error) {
    handleSupabaseError(error, "No se pudo actualizar la categoría", toast);
    return;
  }
  handleSupabaseSuccess("Categoría actualizada correctamente", toast);
  if (onSuccess) await onSuccess();
};

export const deleteCategoryFromSupabase = async (categoryId, toast, onSuccess) => {
  const { data: productsInCategory, error: productCheckError } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', categoryId)
    .limit(1);

  if (productCheckError) {
    handleSupabaseError(productCheckError, "Error al verificar productos en categoría", toast);
    return;
  }

  if (productsInCategory && productsInCategory.length > 0) {
    toast({
      title: "No se puede eliminar",
      description: `Esta categoría tiene productos asociados. Mueve o elimina los productos primero.`,
      variant: "destructive"
    });
    return;
  }

  const { error } = await supabase.from('categories').delete().eq('id', categoryId);
  if (error) {
    handleSupabaseError(error, "No se pudo eliminar la categoría", toast);
    return;
  }
  handleSupabaseSuccess("La categoría se eliminó", toast);
  if (onSuccess) await onSuccess();
};
