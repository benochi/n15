import { exampleItems } from "../exampleData";

export default function SlugPage({ params }: { params: { slug: string } }) {
  const item = exampleItems.find((item) => item.slug === params.slug);

  if (!item) {
    return <h1 className="text-red-500">404 - Item Not Found</h1>;
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">{item.name}</h1>
      <p className="mt-2">This is a dynamically generated page for: {item.name}</p>
    </main>
  );
}
