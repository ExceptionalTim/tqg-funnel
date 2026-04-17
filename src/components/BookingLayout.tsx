import Head from 'next/head';
import { ReactNode } from 'react';

interface BookingLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function BookingLayout({ children, title, description }: BookingLayoutProps) {
  return (
    <>
      <Head>
        <title>{title} — Tour Quality Golf</title>
        {description && <meta name="description" content={description} />}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bayon&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: `tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary-fixed-dim": "#ffb77c",
              "on-tertiary-container": "#303221",
              "inverse-surface": "#e2e2e2",
              "surface-container-lowest": "#0e0e0e",
              "on-secondary": "#003735",
              "on-primary-fixed-variant": "#6d3900",
              "secondary-fixed-dim": "#78d6d0",
              "on-background": "#e2e2e2",
              "secondary": "#78d6d0",
              "error": "#ffb4ab",
              "surface-tint": "#ffb77c",
              "on-primary-container": "#4d2700",
              "tertiary-fixed-dim": "#c8c8c8",
              "surface-dim": "#131313",
              "primary-fixed": "#ffdcc2",
              "surface-container": "#1f1f1f",
              "background": "#131313",
              "on-tertiary-fixed": "#1b1d0e",
              "on-surface": "#e2e2e2",
              "surface-container-low": "#1b1b1b",
              "error-container": "#93000a",
              "surface-container-highest": "#353535",
              "on-surface-variant": "#d8c2b4",
              "primary-container": "#d38743",
              "outline-variant": "#534439",
              "on-secondary-fixed-variant": "#00504c",
              "on-primary-fixed": "#2e1500",
              "surface": "#131313",
              "on-tertiary": "#303221",
              "on-error": "#690005",
              "on-error-container": "#ffdad6",
              "outline": "#a08d80",
              "surface-variant": "#353535",
              "secondary-fixed": "#94f3ec",
              "primary": "#ffb77c",
              "tertiary": "#c8c8b0",
              "surface-container-high": "#2a2a2a",
              "inverse-primary": "#8d4f0c",
              "secondary-container": "#007d78",
              "tertiary-container": "#999a84",
              "on-secondary-fixed": "#00201e",
              "tertiary-fixed": "#e4e4cc",
              "surface-bright": "#393939",
              "inverse-on-surface": "#303030",
              "on-secondary-container": "#c7fffa",
              "on-primary": "#4d2700",
              "on-tertiary-fixed-variant": "#474836"
            },
            fontFamily: {
              "bayon": ["Bayon", "sans-serif"],
              "open-sans": ["Open Sans", "sans-serif"],
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
      }` }} />
        <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Open Sans', sans-serif; }
        h1, h2, h3 { font-family: 'Bayon', sans-serif; }
      ` }} />
      </Head>
      <div className="bg-background text-on-background antialiased min-h-screen">
        {/* Header */}
        <header className="bg-[#131313] fixed top-0 w-full z-50">
          <div className="flex justify-center items-center w-full py-6 px-8 max-w-7xl mx-auto">
            <div className="w-full flex justify-start items-center">
              <a href="/">
                <img
                  alt="Tour Quality Golf Logo"
                  className="h-12 w-auto cursor-pointer"
                  src="https://www.tourqualitygolf.com/wp-content/uploads/2021/09/tour-quality-logo-1.webp"
                />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-surface-container-lowest py-8 w-full border-t border-outline-variant/5">
          <div className="flex justify-center items-center w-full px-4">
            <span className="text-[10px] font-normal tracking-widest text-on-surface-variant opacity-60 uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              © 2024 Tour Quality Golf Tulsa. All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
