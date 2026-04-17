// This file is deprecated. The app has been migrated to Next.js 14 App Router.
// Please use the /app directory for the new Next.js structure.
// Run: npm run dev (or pnpm dev)

export default function App() {
  return (
    <div className="size-full flex items-center justify-center flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Quran App - Next.js Version</h1>
      <p className="text-center max-w-md text-muted-foreground">
        This app has been migrated to Next.js 14 with App Router.
        Please run <code className="bg-muted px-2 py-1 rounded">npm run dev</code> to start the Next.js development server.
      </p>
    </div>
  );
}
