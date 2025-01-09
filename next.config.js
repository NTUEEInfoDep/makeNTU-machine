/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // async redirects() {
  //   return [
  //     {
  //       source: "http://localhost:3000",
  //       destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
// module.exports = {
//   webpack: (config, { isServer }) => {
//     config.module.rules.push({
//       test: /\.html$/,
//       use: 'html-loader',
//     });

//     return config;
//   },
// };
module.exports = {
  reactStrictMode: false,
};
