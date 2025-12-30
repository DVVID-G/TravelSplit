import { Header } from '@/components';

/**
 * Home page component
 */
export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TravelSplit</h1>
          <p className="text-gray-600">Sistema de gestión de gastos de viaje</p>
        </div>
      </div>
    </div>
  );
};
