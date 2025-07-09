import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

import Home from './pages/Home';

const routes = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
