import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { flatRoutes } from 'remix-flat-routes';
import { remixDevTools } from "remix-development-tools";



export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
        'process.env.POSTGRES_URL': JSON.stringify(env.POSTGRES_URL),
    },
    plugins: [
      remixDevTools(),
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
        ignoredRouteFiles: ['**/.*'],
        routes: async defineRoutes => {
          return flatRoutes('routes', defineRoutes)
        },
      }),
      tsconfigPaths(),
    ]
  }
  });
