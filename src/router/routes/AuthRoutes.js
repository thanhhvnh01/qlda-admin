import { lazy } from 'react';

const AuthRoutes = [
  {
    path: '/login',
    component: lazy(() => import('@views/auth/Login')),
    meta: {
      authRoute: true,
    },
  },
];

export default AuthRoutes;
