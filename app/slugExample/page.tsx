import Link from "next/link";
//instead of static data you would use {useQuery} from "@tanstack/react-query";
import { exampleItems, ExampleItem } from "./exampleData";
import slugify from "slugify";

export default function SlugExamplePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Slug Example - This is how you can map links to all your slug pages</h1>
      <ul className="mt-4 space-y-2">
        {exampleItems.map((item: ExampleItem) => (
          <li key={item.id}>
            <Link
              href={`/slugExample/${slugify(item.name, { lower: true })}`}
              className="text-blue-500 hover:underline"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
