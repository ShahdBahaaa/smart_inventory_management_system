import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/store/AuthContext';
import { POProvider } from '@/store/POContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <POProvider>
          <Router>
            <AppRoutes />
          </Router>
        </POProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
