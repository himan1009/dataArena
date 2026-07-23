"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function isSamePageNavigation(
  href: string,
  pathname: string,
  search: string,
) {
  try {
    const url = new URL(href, window.location.origin);
    return url.pathname === pathname && url.search === search;
  } catch {
    return true;
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, search]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank") {
        return;
      }

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          return;
        }

        const nextSearch = url.search.startsWith("?")
          ? url.search.slice(1)
          : url.search;

        if (isSamePageNavigation(href, pathname, search)) {
          return;
        }

        if (nextSearch === search && url.pathname === pathname) {
          return;
        }

        setIsNavigating(true);
      } catch {
        // Ignore malformed href values.
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, search]);

  if (!isNavigating) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent">
      <div className="navigation-progress-bar navigation-progress-bar--active h-full w-full origin-left bg-gradient-to-r from-gold via-primary to-teal" />
    </div>
  );
}
