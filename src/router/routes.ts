import { ComponentType } from 'react';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';

export interface IRoute {
  path: string;
  element: ComponentType;
}

export const routes: IRoute[] = [
  { path: '/', element: Home },
  { path: '/login', element: Login },
  { path: '/register', element: Register },
  { path: '/profile', element: Profile },
];
