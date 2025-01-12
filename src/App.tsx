import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from '@/router/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import NavBar from '@/components/NavBar';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log(onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Checking login status
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <main data-theme={theme}>
      <NavBar />
      <Routes>
        {routes.map(({ path, element: Element, isPrivate, isPublicOnly }) => {
          let routeElement = <Element />;

          if (isPrivate && !authUser) {
            routeElement = <Navigate to="/login" />;
          } else if (isPublicOnly && authUser) {
            routeElement = <Navigate to="/" />;
          }

          return <Route key={path} path={path} element={routeElement} />;
        })}
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
