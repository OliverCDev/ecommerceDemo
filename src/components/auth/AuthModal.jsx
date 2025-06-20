import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const { login, register, loginWithGoogle } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    let success = false;
    if (isLogin) {
      success = await login(formData.email, formData.password);
    } else {
      success = await register({
        ...formData,
        role: 'client'
      });
    }
    if (success) {
      handleClose(); 
    }
  };

  const handleGoogleLoginInternal = async () => {
    await loginWithGoogle();
    // No es necesario cerrar el modal aquí, ya que la redirección de OAuth se encargará.
    // Si la redirección no ocurre o falla, el usuario permanecerá en la página actual.
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setShowPassword(false);
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setShowPassword(false);
    setIsLogin(true);
    onClose();
  };

  const passwordValidation = validatePassword(formData.password);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6 flex-grow">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={isLogin ? "default" : "outline"}
                onClick={() => setIsLogin(true)}
                className="w-full"
              >
                Iniciar Sesión
              </Button>
              <Button
                variant={!isLogin ? "default" : "outline"}
                onClick={switchMode}
                className="w-full"
              >
                Registrarse
              </Button>
            </div>

            <Button
              onClick={handleGoogleLoginInternal}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o con tu email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    placeholder="tu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.password}
                  </p>
                )}
                
                {!isLogin && formData.password && (
                  <div className="mt-2 space-y-0.5">
                    <p className={`flex items-center text-xs ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.hasMinLength ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      Mínimo 8 caracteres
                    </p>
                    <p className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      Al menos un número
                    </p>
                    <p className={`flex items-center text-xs ${passwordValidation.hasSymbol ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.hasSymbol ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      Al menos un símbolo (!@#$)
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5"
              >
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;