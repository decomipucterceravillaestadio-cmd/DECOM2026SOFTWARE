import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  breadcrumbs?: BreadcrumbItem[];
  rightElement?: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function Layout({
  title,
  subtitle,
  showBackButton = true,
  backHref,
  breadcrumbs,
  rightElement,
  isLoading = false,
  error,
  onRetry,
  children,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-decom-bg-light flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-decom-border shadow-sm">
        <div className="px-4 py-4 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-2">
              <ol className="flex items-center space-x-2 text-sm text-decom-text-light">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-decom-primary transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-decom-text-dark font-medium">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Title Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {showBackButton && (
                <Link
                  href={backHref || "/"}
                  className="text-decom-primary hover:opacity-70 transition-opacity p-2 -m-2"
                  aria-label="Volver atrás"
                >
                  ← Atrás
                </Link>
              )}
              <div>
                <h1 className="text-xl font-bold text-decom-text-dark">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-decom-text-light mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            {rightElement}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
        {error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="text-6xl">⚠️</div>
              <h2 className="text-xl font-semibold text-decom-text-dark">
                Algo salió mal
              </h2>
              <p className="text-decom-text-light max-w-md">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-decom-primary text-white rounded-lg hover:bg-decom-primary/90 transition-colors"
                >
                  Intentar nuevamente
                </button>
              )}
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-decom-primary/30 border-t-decom-primary rounded-full animate-spin mx-auto"></div>
              <p className="text-decom-text-light">Cargando...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-decom-border bg-white py-6 px-4 text-center text-sm text-decom-text-light mt-auto">
        <p>Sistema DECOM &copy; 2026 - Iglesia Pentecostal Unida</p>
      </footer>
    </div>
  );
}
