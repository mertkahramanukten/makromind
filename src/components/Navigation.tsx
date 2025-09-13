'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  showHome?: boolean;
  showBack?: boolean;
  backUrl?: string;
  title?: string;
}

export function Navigation({ 
  showHome = true, 
  showBack = true, 
  backUrl,
  title 
}: NavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <nav className="mb-6">
      <div className="flex items-center justify-between">
        {/* Sol taraf - Geri butonu */}
        <div className="flex items-center space-x-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm 
                border border-gray-200 rounded-xl text-gray-700 hover:bg-white/80 
                hover:shadow-md transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Geri</span>
            </button>
          )}
          
          {title && (
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          )}
        </div>

        {/* Sağ taraf - Ana sayfa butonu */}
        {showHome && (
          <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 
              text-white rounded-xl hover:from-pink-600 hover:to-purple-700 
              shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm font-medium">Ana Sayfa</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
