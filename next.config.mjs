const backendBaseUrl = String(
  process.env.API_BASE_URL || "http://127.0.0.1:5000"
).replace(/\/+$/, "");

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend-api/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`
      },
      {
        source: "/uploads/:path*",
        destination: `${backendBaseUrl}/uploads/:path*`
      }
    ];
  }
};

export default nextConfig;
