import { getCategories, getProducts } from "@/lib/fetcher";
import { resolveSiteHref } from "@/lib/siteMetadata";

export default async function sitemap() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 50 })
  ]);

  const staticRoutes = [
    "/",
    "/categories",
    "/search",
    "/track-order",
    "/terms-and-conditions",
    "/return-policy"
  ].map((pathname) => ({
    url: resolveSiteHref(pathname),
    lastModified: new Date(),
    changeFrequency: pathname === "/" ? "daily" : "weekly",
    priority: pathname === "/" ? 1 : 0.7
  }));

  const categoryRoutes = categories.map((category) => ({
    url: resolveSiteHref(`/categories/${category.slug}`),
    lastModified: new Date(category.updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const productRoutes = featuredProducts.map((product) => ({
    url: resolveSiteHref(`/product/${product._id}`),
    lastModified: new Date(product.updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.75
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
