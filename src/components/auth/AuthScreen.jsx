import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, Store, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const { login, register } = useAuth();

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

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!isLogin) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluir números y símbolos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isLogin) {
      login(formData.email, formData.password);
    } else {
      // Solo permitir registro de clientes
      register({
        ...formData,
        role: 'client'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const demoLogin = (role) => {
    if (role === 'admin') {
      login('admin@tienda.com', 'admin123');
    } else {
      login('cliente@tienda.com', 'cliente123');
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setShowPassword(false);
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="gradient-bg p-8 text-white text-center">
            <Store className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">MiTienda Pro</h1>
            <p className="opacity-90">Tu plataforma de e-commerce</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="flex mb-6">
              <Button
                variant={isLogin ? "default" : "ghost"}
                onClick={() => setIsLogin(true)}
                className="flex-1 mr-2"
              >
                Iniciar Sesión
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                onClick={switchMode}
                className="flex-1 ml-2"
              >
                Registrarse
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="tu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
                
                {/* Password Requirements for Registration */}
                {!isLogin && formData.password && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-600">Requisitos de contraseña:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center text-xs ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-red-500'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasMinLength ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        Mínimo 8 caracteres
                      </div>
                      <div className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        Al menos un número
                      </div>
                      <div className={`flex items-center text-xs ${passwordValidation.hasSymbol ? 'text-green-600' : 'text-red-500'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasSymbol ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        Al menos un símbolo (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Nota:</strong> Solo puedes registrarte como cliente. Los administradores son creados por otros administradores.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta de Cliente'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3 text-center">Cuentas de demostración:</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => demoLogin('admin')}
                  className="w-full text-sm"
                >
                  Demo Administrador
                </Button>
                <Button
                  variant="outline"
                  onClick={() => demoLogin('client')}
                  className="w-full text-sm"
                >
                  Demo Cliente
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthScreen;