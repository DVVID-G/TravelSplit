import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Plus, User } from 'lucide-react';

/**
 * BottomTabBar organism component
 * Fixed bottom navigation bar with FAB for new expense
 * Follows Design System Guide: fixed bottom-0, z-50, 4 items, FAB central elevated
 */
export const BottomTabBar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto relative">
        {/* Grid with 4 equal columns for symmetric distribution */}
        <div className="grid grid-cols-4 items-center h-16 px-2">
          {/* Home - Column 1 */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 rounded-lg p-1 ${
              isActive('/') ? 'text-violet-600' : 'text-slate-400'
            }`}
          >
            <Home size={24} />
            <span className="text-xs font-medium">Inicio</span>
          </Link>

          {/* Mis Viajes - Column 2 */}
          <Link
            to="/trips"
            className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 rounded-lg p-1 ${
              isActive('/trips') ? 'text-violet-600' : 'text-slate-400'
            }`}
          >
            <Map size={24} />
            <span className="text-xs font-medium">Viajes</span>
          </Link>

          {/* FAB Space - Column 3 (invisible, FAB overlays this) */}
          <div className="flex items-center justify-center" aria-hidden="true">
            {/* FAB - Nuevo Gasto (centered absolutely, overlays column 3) */}
            <Link
              to="/expenses/new"
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-violet-700 active:scale-98 active:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 transition-all z-10"
              aria-label="Nuevo gasto"
            >
              <Plus size={28} />
            </Link>
          </div>

          {/* Perfil - Column 4 */}
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 rounded-lg p-1 ${
              isActive('/profile') ? 'text-violet-600' : 'text-slate-400'
            }`}
          >
            <User size={24} />
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

