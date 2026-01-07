import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

interface HeaderProps {
  /** Show navigation actions (default: true) */
  showActions?: boolean;
  /** Custom title (default: "TravelSplit") */
  title?: string;
  /** Custom actions to render */
  actions?: ReactNode;
}

/**
 * Header organism component
 * Complex component combining multiple molecules and atoms
 * Follows Design System Guide: pattern [←] Título [Acciones]
 * 
 * Variants:
 * - Simple: Only title (for HomePage not authenticated)
 * - With actions: Title + navigation actions (default)
 * 
 * UX/UI: Muestra diferentes acciones según el estado de autenticación:
 * - No autenticado: Botón "Iniciar Sesión"
 * - Autenticado: Nombre del usuario y botón "Cerrar Sesión"
 */
export const Header = ({ showActions = true, title = 'TravelSplit', actions }: HeaderProps) => {
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const defaultActions = isAuthenticated ? (
    <nav className="flex items-center space-x-4">
      <Link to="/" className="text-slate-700 hover:text-slate-900 transition-colors">
        Inicio
      </Link>
      {user && (
        <span className="text-slate-700 text-sm font-medium">
          {user.nombre}
        </span>
      )}
      <Button variant="secondary" size="sm" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </nav>
  ) : (
    <nav className="flex items-center space-x-4">
      <Link to="/" className="text-slate-700 hover:text-slate-900 transition-colors">
        Inicio
      </Link>
      <Link to="/login">
        <Button variant="primary" size="sm">
          Iniciar Sesión
        </Button>
      </Link>
    </nav>
  );

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-md md:max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-slate-900">
              {title}
            </Link>
          </div>
          {showActions && (actions || defaultActions)}
        </div>
      </div>
    </header>
  );
};
