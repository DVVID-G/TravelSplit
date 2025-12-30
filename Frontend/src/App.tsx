import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BottomTabBar } from '@/components/organisms/BottomTabBar';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ExpenseFormPage } from '@/pages/ExpenseFormPage';
import { ProtectedRoute } from '@/components/molecules/ProtectedRoute';

/**
 * React Query client configuration
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Layout component that conditionally shows BottomTabBar
 */
function AppLayout() {
  const location = useLocation();
  const hideNavRoutes = ['/login', '/register'];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      <Outlet />
      {shouldShowNav && <BottomTabBar />}
    </>
  );
}

/**
 * Root application component
 * Configures React Router, React Query, and Authentication
 */
function App() {
  // Create router inside component to ensure AuthProvider is available
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          element: <AppLayout />,
          children: [
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
          ],
        },
      ]),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
