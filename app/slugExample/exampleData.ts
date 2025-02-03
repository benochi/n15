import slugify from "slugify";

export const exampleItems = [
  { id: 1, name: "Example 1" },
  { id: 2, name: "FooBar Coffee" },
  { id: 3, name: "Example 3" },
].map((item) => ({
  ...item,
  slug: slugify(item.name, { lower: true }),
}));
