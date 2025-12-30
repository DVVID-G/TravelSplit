import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

/**
 * Root application component
 * Configures React Router for navigation
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
