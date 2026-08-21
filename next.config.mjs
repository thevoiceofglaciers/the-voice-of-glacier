const wpRemotePatterns = [];

// Derives the WordPress media host from WORDPRESS_GRAPHQL_URL so the Media
// Library domain doesn't need to be hardcoded/duplicated here.
if (process.env.WORDPRESS_GRAPHQL_URL) {
  try {
    const { protocol, hostname } = new URL(process.env.WORDPRESS_GRAPHQL_URL);
    wpRemotePatterns.push({
      protocol: protocol.replace(":", ""),
      hostname,
      pathname: "/wp-content/uploads/**",
    });
  } catch {
    // Ignore malformed URL — image loading from WP just won't be allowlisted yet.
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // TODO: remove the GitHub patterns once the 7 legacy dialogues are fully
    // migrated into WordPress and no longer reference raw.githubusercontent.com images.
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
      ...wpRemotePatterns,
    ],
  },
};

export default nextConfig;
