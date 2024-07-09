/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['jotai-devtools'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'media.tenor.com',
                port: ''
            }
        ],
    },
};

export default nextConfig;
