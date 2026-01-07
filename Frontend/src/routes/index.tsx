import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ExpenseFormPage } from '@/pages/ExpenseFormPage';
import { ProtectedRoute } from '@/components/molecules/ProtectedRoute';

/**
 * Router configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/trips/:tripId/expenses/new',
    element: (
      <ProtectedRoute>
        <ExpenseFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/expenses/new',
    element: (
      <ProtectedRoute>
        <ExpenseFormPage />
      </ProtectedRoute>
    ),
  },
]);
