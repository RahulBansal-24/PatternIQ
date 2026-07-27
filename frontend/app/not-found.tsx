import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-100 dark:from-slate-950 dark:via-teal-950 dark:to-emerald-950 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-2xl text-muted-foreground mb-6">Page Not Found</p>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 gradient-bg text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
