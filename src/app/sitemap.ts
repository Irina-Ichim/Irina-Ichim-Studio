import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://irinaichim.studio";

  // De momento sólo tenemos la página principal, pero aquí añadiremos dinámicamente las rutas del estudio
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
