import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

import Home from './pages/Home';
import { OAuthCallback } from './pages/OAuthCallback';

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
  { path: '/oauth-callback/:id', element: <OAuthCallback /> }, // Placeholder for OAuth callback
];

export const router = createBrowserRouter(routes);
