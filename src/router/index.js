import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Layout from '../layouts';
import { getAToken } from '../layouts/components/utils/api';

export const ChatPage = lazy(() => import('../pages/chatAI'));
export const DBPage = lazy(() => import('../pages/dbmanage'));
export const LoginPage = lazy(() => import('../pages/auth'));
export const Page404 = lazy(() => import('../pages/page-not-found'));
export const CollectionPage = lazy(() => import('../pages/collection'))

export default function Router() {

  const token = getAToken();

  const getAuthenticatedRoutes = () => [
    {
      element: (
        <Layout>
          <Suspense>
            <Outlet/>
          </Suspense>
        </Layout>
      ),
      children: [
        { path: 'index', element: <ChatPage />, index: true },
        { path: 'dbmanage', element: <DBPage /> },
        { path: 'collection', element: <CollectionPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '',
      element: <Navigate to="/login" replace />,
    },
  ];

  const getUnauthenticatedRoutes = () => [
    { path: '*', element: <Navigate to="/login" replace /> },
    { path: 'login', element: <LoginPage /> },
  ];

  const routes = useRoutes(token !== null ? getAuthenticatedRoutes() : getUnauthenticatedRoutes());
  
  return routes;
}
