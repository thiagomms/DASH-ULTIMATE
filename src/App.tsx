import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Faturamentos } from './pages/Faturamentos';
import { DashboardComercial } from './pages/DashboardComercial';
import { TicketMedio } from './pages/TicketMedio';
import { Login } from './pages/Login';
import { ExcelImport } from './pages/Excel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>      
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardComercial />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
      <DashboardComercial />      
            </ProtectedRoute>
          } />
          <Route path="/faturamento" element={
            <ProtectedRoute>
              <Faturamentos />
            </ProtectedRoute>
          } />
          <Route path="/ticket-medio" element={
            <ProtectedRoute>
              <TicketMedio />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/recorrencia-excel" element={
            <ProtectedRoute>
              <ExcelImport />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;