import { createBrowserRouter, Outlet } from 'react-router-dom';

import Home from './pages/Home';

const routes = [
  {
    element: <Outlet />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
