import { headers } from "next/headers";

export default function robots() {
  const host = headers().get("host") || "";
  const isStaging = host === "staging.thevoiceofglaciers.org";

  if (isStaging) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
