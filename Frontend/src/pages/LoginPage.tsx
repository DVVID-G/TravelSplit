import { Header } from '@/components';
import { Link } from 'react-router-dom';

/**
 * Login page component (placeholder)
 */
export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center w-full max-w-md">
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-4">Iniciar Sesión</h1>
          <p className="text-slate-600 mb-6">Página de login (pendiente de implementación)</p>
          <p className="text-sm text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-violet-600 hover:text-violet-700 font-medium">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
