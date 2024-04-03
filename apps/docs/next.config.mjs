import createMDX from 'fumadocs-mdx/config';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  reactStrictMode: true,
  basePath: '/uwu',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/uwu',
        permanent: false,
        basePath: false,
      },
    ];
  }
};

export default withMDX(config);
