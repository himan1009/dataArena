"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 500);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent">
      <div className="navigation-progress-bar h-full w-full origin-left bg-gradient-to-r from-gold via-primary to-teal" />
    </div>
  );
}
