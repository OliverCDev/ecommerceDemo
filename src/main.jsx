import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext'
import { DataProvider } from '@/contexts/DataContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  // Quitamos StrictMode para evitar montajes dobles mientras depuramos
  <Router>
    <AuthProvider>
      <DataProvider>
        <App />
        <Toaster />
      </DataProvider>
    </AuthProvider>
  </Router>,
)