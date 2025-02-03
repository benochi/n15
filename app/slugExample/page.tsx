import Link from "next/link";
import { exampleItems } from "./exampleData";

export default function SlugExamplePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Slug Example</h1>
      <ul className="mt-4 space-y-2">
        {exampleItems.map((item) => (
          <li key={item.id}>
            <Link href={`/slugExample/${item.slug}`} className="text-blue-500 hover:underline">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
