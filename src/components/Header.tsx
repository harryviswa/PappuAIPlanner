import { Globe } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Globe className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Smart Trip Planner</h1>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
