import { notFound } from "next/navigation";
import slugify from "slugify";

// Normally, you wouldn't import static data like this.
// Instead, you'd fetch data from a database or API.
import { exampleItems, ExampleItem } from "../exampleData";

export default async function SlugPage({ params }: { params: { slug: string } }) {
  // 🔹 Normally, you would fetch data from a database here:
  // Example:
  // const res = await fetch(`https://your-api.com/items/${params.slug}`);
  // const item = await res.json();
  // if (!item) { notFound(); }

  // Instead of fetching, we are using static example data for demonstration.
  const item = exampleItems.find(
    (item: ExampleItem) => slugify(item.name, { lower: true }) === params.slug
  );

  if (!item) {
    notFound();
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">{item.name}</h1>
      <p className="mt-2">This is a dynamically generated page for: {item.name}</p>
    </main>
  );
}
