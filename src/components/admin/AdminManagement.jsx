import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Shield, Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const AdminManagement = ({ openFormModal, onModalOpenHandled }) => {
  const { createAdmin, getAllUsers, deleteUser, user: currentUser, profile } = useAuth();
  const [adminUsers, setAdminUsers] = useState([]);
  const [allRegisteredUsers, setAllRegisteredUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (openFormModal) {
      resetForm();
      setShowAdminDialog(true);
      onModalOpenHandled(); 
    }
  }, [openFormModal, onModalOpenHandled]);

  const fetchUsers = useCallback(async () => {
    if (!(profile && profile.role === 'admin')) {
      setLoadingUsers(false);
      return; 
    }
    setLoadingUsers(true);
    try {
      const users = await getAllUsers();
      if (users) {
        setAllRegisteredUsers(users);
        setAdminUsers(users.filter(user => user.role === 'admin'));
      } else {
        setAllRegisteredUsers([]);
        setAdminUsers([]);
      }
    } catch (error) {
      toast({
        title: "Error al cargar usuarios",
        description: "No se pudieron obtener los datos de los usuarios.",
        variant: "destructive",
      });
      setAllRegisteredUsers([]);
      setAdminUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, [getAllUsers, profile]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: hasMinLength && hasNumber && hasSymbol,
      hasMinLength,
      hasNumber,
      hasSymbol
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email no es válido';
    } else if (allRegisteredUsers.some(user => user.email === formData.email)) {
      newErrors.email = 'Ya existe un usuario con este email';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluir números y símbolos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await createAdmin({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (success) {
      setShowAdminDialog(false);
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
      fetchUsers(); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (currentUser && currentUser.id === adminId) {
      toast({
        title: "Acción no permitida",
        description: "No puedes eliminar tu propia cuenta de administrador.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar al administrador ${adminName}? Esta acción no se puede deshacer.`)) {
      await deleteUser(adminId);
      fetchUsers(); 
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setShowPassword(false);
  };

  const passwordValidation = validatePassword(formData.password);
  
  if (!(profile && profile.role === 'admin') && !loadingUsers) {
    return (
      <div className="p-4 md:p-8 text-center">
        <Shield className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">Acceso Restringido</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          No tienes permisos para ver esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Administradores</h2>
          <p className="text-gray-600">Administra los usuarios con permisos de administrador.</p>
        </div>
        <Dialog open={showAdminDialog} onOpenChange={(isOpen) => {
          setShowAdminDialog(isOpen);
          if (!isOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-transform transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Administrador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl font-semibold text-gray-700">
                <Shield className="w-6 h-6 mr-3 text-purple-600" />
                Agregar Nuevo Administrador
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre completo</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-10 w-full ${errors.name ? 'border-red-500 focus:border-red-500 ring-red-500' : 'focus:border-purple-500 ring-purple-500'}`}
                    placeholder="Nombre del administrador"
                  />
                </div>
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 w-full ${errors.email ? 'border-red-500 focus:border-red-500 ring-red-500' : 'focus:border-purple-500 ring-purple-500'}`}
                    placeholder="admin@empresa.com"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 w-full ${errors.password ? 'border-red-500 focus:border-red-500 ring-red-500' : 'focus:border-purple-500 ring-purple-500'}`}
                    placeholder="Contraseña segura"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-500">Requisitos de contraseña:</p>
                    <div className="space-y-0.5">
                      <div className={`flex items-center text-xs ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.hasMinLength ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        Mínimo 8 caracteres
                      </div>
                      <div className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        Al menos un número
                      </div>
                      <div className={`flex items-center text-xs ${passwordValidation.hasSymbol ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.hasSymbol ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        Al menos un símbolo (!@#$%)
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md">
                  Crear Administrador
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAdminDialog(false)}
                  className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loadingUsers ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="ml-4 text-lg text-gray-600">Cargando administradores...</p>
        </div>
      ) : (
        <>
          {adminUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {adminUsers.map((admin) => (
                  <motion.div
                    key={admin.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200"
                  >
                    <div className="flex items-center space-x-4 mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-800 truncate" title={admin.full_name}>{admin.full_name || 'Nombre no disponible'}</h3>
                        <p className="text-sm text-gray-500 truncate" title={admin.email}>{admin.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">Rol:</span>
                        <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-bold">
                          Administrador
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">Creado:</span>
                        <span className="text-gray-700">
                          {admin.created_at ? new Date(admin.created_at).toLocaleDateString('es-ES') : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                        onClick={() => toast({
                          title: "🚧 Función en desarrollo",
                          description: "La edición de administradores estará disponible pronto.",
                        })}
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDeleteAdmin(admin.id, admin.full_name || admin.email)}
                        disabled={currentUser && currentUser.id === admin.id}
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Eliminar
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <Shield className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No hay administradores</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Parece que aún no has agregado ningún administrador. ¡Crea el primero para empezar a gestionar tu plataforma!
              </p>
              <Button 
                onClick={() => {
                  resetForm();
                  setShowAdminDialog(true);
                }}
                className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-transform transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar Primer Administrador
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminManagement;