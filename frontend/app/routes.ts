import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('auth', 'routes/auth.tsx'),
  route('dashboard', 'routes/dashboard.tsx'),
  route('shops', 'routes/shops.tsx'),
  route('shops/new', 'routes/shops.new.tsx'),
  route('shops/:shopId/dashboard', 'routes/shops.$shopId.dashboard.tsx'),
] satisfies RouteConfig;
