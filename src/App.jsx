import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { AppRouter } from '@/components/AppRouter';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <AppRouter />
          <Toaster />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;