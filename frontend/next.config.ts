import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname, '.'),  // força raiz como a pasta frontend/
  },
};

export default nextConfig;
