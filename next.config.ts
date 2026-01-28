import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,

    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src')
        config.resolve.alias['@/ui'] = path.resolve(__dirname, 'src/components/ui')

        return config
    },
}

export default nextConfig
