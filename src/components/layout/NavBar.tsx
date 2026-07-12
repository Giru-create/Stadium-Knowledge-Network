// src/components/layout/NavBar.tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/archives', label: 'Archives' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/history', label: 'History' },
  { href: '/hospitality', label: 'Hospitality' },
  { href: '/learn-more', label: 'Learn More' },
];

export const NavBar = () => {
  const router = useRouter();

  const handleCta = () => {
    router.push('/library');
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-sm transform rotate-12 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3"
              />
            </svg>
          </div>
          <span className="text-xl font-black uppercase tracking-[ -0.02em ]" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
            STADIUM KNOWLEDGE NETWORK
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-6" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-gray-900 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-red-600 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Button
          variant="primary"
          onClick={handleCta}
          className="hidden md:flex items-center space-x-1 bg-gray-900 text-white hover:bg-gray-800 transition-transform transform hover:scale-105"
        >
          <span>ACCESS LIBRARY</span>
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
};
