import { Routes, Route } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { routes } from '@/router/routes';

const App = () => {
  return (
    <main>
      <NavBar />
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Routes>
    </main>
  );
};

export default App;
