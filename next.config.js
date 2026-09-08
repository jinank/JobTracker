/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  },
  async redirects() {
    return [
      {
        source: "/find-jobs",
        destination: "/find-internships",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
