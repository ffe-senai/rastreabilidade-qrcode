import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

// Remote do Módulo G4. O App Shell (Grupo 1) carrega http://localhost:8083/remoteEntry.js
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'smart40_g4',
      filename: 'remoteEntry.js',
      dts: false,
      exposes: {
        './Traceability': './src/Traceability.jsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  server: { port: 8083, strictPort: true, origin: 'http://localhost:8083', cors: true },
  preview: { port: 8083, strictPort: true, cors: true },
  build: { target: 'chrome89' },
});
