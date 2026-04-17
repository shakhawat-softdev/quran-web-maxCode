import Link from 'next/link';
import { BookMarked } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
          <BookMarked className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-['Poppins'] font-semibold text-foreground mb-3">404</h1>
        <h2 className="text-xl font-['Poppins'] text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-['Poppins']"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
