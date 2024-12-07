"use client";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background text-foreground">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Your Template</h1>
        <p className="text-lg special-font1">Special font test area</p>
      </header>
      <main className="flex flex-col items-center gap-4">
        <button
          className="px-6 py-3 bg-primary text-background rounded shadow-sm hover:bg-primary/90"
          onClick={() => alert("Primary Button Works!")}
        >
          Primary Button
        </button>
        <div className="grid gap-4">
          <div className="p-4 border shadow-sm rounded bg-white">
            <p>Shadow - Small (sm)</p>
          </div>
          <div className="p-4 border shadow-md rounded bg-white">
            <p>Shadow - Medium (md)</p>
          </div>
          <div className="p-4 border shadow-lg rounded bg-white">
            <p>Shadow - Large (lg)</p>
          </div>
          <div className="p-4 border shadow-xl rounded bg-white">
            <p>Shadow - Extra Large (xl)</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="p-4 bg-background text-foreground rounded">
            Default Background
          </div>
          <div className="p-4 bg-dark-background text-dark-foreground rounded">
            Dark Background
          </div>
        </div>
      </main>
    </div>
  );
}
