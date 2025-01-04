import { ComponentType } from 'react';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';

export interface IRoute {
  path: string;
  element: ComponentType;
  isPrivate?: boolean;
  isPublicOnly?: boolean;
}

export const routes: IRoute[] = [
  // limit logged
  { path: '/', element: Home, isPrivate: true },
  { path: '/profile', element: Profile, isPrivate: true },
  // limit not logged
  { path: '/login', element: Login, isPublicOnly: true },
  { path: '/register', element: Register, isPublicOnly: true },
];
