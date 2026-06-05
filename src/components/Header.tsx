import { Link, useLocation } from 'react-router-dom';
import { Flame, ArrowLeft } from 'lucide-react';
import { SearchBar } from './SearchBar';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            {!isHome && (
              <button className="mr-2 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-poppins font-bold text-lg text-gray-800 hidden sm:block">
              零食热量计算器
            </span>
          </Link>

          {!isHome && (
            <div className="flex-1 max-w-md">
              <SearchBar variant="normal" />
            </div>
          )}

          <div className="w-9" />
        </div>
      </div>
    </header>
  );
}
