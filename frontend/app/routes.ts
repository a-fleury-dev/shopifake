import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('auth', 'routes/auth.tsx'),
  route('dashboard', 'routes/dashboard.tsx'),
  route('shops', 'routes/shops.tsx'),
  route('shops/new', 'routes/shops.new.tsx'),
  route('shops/:shopId/dashboard', 'routes/shops.$shopId.dashboard.tsx'),
  
  // Public storefront routes (must be at the end to avoid conflicts)
  route(':domainName', 'routes/$domainName.tsx'),
  route(':domainName/products/:slug', 'routes/$domainName.products.$slug.tsx'),
] satisfies RouteConfig;
