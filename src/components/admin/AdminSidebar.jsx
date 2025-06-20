
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminSidebar = ({ user, logout, menuItems, currentView, setCurrentView }) => {
  const userName = user?.full_name || user?.email || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>
      
      <nav className="mt-6 flex-grow">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors duration-200 ease-in-out ${
              currentView === item.id 
                ? 'bg-blue-100 border-r-4 border-blue-500 text-blue-700 font-semibold' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {userInitial}
          </div>
          <div>
            <p className="font-semibold text-gray-800 truncate max-w-[150px]" title={userName}>{userName}</p>
            <p className="text-sm text-gray-600">Administrador</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
