import { Link } from 'react-router-dom';
import { Button } from '../atoms/Button';

/**
 * Header organism component
 * Complex component combining multiple molecules and atoms
 */
export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              TravelSplit
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Inicio
            </Link>
            <Link to="/login">
              <Button variant="primary" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
