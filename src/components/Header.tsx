import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flame, ArrowLeft, History, Palette, Check, Heart } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useTheme, themes } from '../utils/ThemeContext';
import { useFavorites } from '../utils/useFavorites';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isRecords = location.pathname === '/records';
  const isFavorites = location.pathname === '/favorites';
  const { currentTheme, setTheme } = useTheme();
  const { favorites } = useFavorites();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="mr-2 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              >
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

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isHome
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              首页
            </Link>
            <Link
              to="/favorites"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isFavorites
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-4 h-4" />
              我的收藏
              {favorites.length > 0 && (
                <span className="text-xs bg-primary-500 text-white px-1.5 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              to="/records"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isRecords
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4" />
              热量记录
            </Link>
          </nav>

          {!isHome && !isRecords && !isFavorites && (
            <div className="flex-1 max-w-md">
              <SearchBar variant="normal" />
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="切换主题"
            >
              <Palette className="w-5 h-5 text-gray-600" />
            </button>
            
            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setTheme(key);
                        setShowThemeMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.primary[500] }}
                        />
                        <span className="text-sm text-gray-700">{theme.name}</span>
                      </div>
                      {currentTheme === key && (
                        <Check className="w-4 h-4 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link
            to="/favorites"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <Heart className={`w-5 h-5 ${isFavorites ? 'text-primary-500' : 'text-gray-600'}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full">
                {favorites.length > 9 ? '9+' : favorites.length}
              </span>
            )}
          </Link>
          <Link
            to="/records"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <History className={`w-5 h-5 ${isRecords ? 'text-primary-500' : 'text-gray-600'}`} />
          </Link>
        </div>
      </div>
    </header>
  );
}
