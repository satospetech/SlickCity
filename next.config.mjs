/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
      instrumentationHook: true,
      serverActions: {
        bodySizeLimit: '100mb', // maximum `4.5MB/4MB` if you are using Vercel
      },
    },
  };
  
  export default nextConfig;