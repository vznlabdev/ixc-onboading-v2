'use client';

// Theme configuration is now handled by Tailwind CSS
// All colors and typography are defined in tailwind.config.ts and globals.css
// This component is kept for compatibility but no longer uses MUI

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

