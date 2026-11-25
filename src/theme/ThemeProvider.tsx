import React, { useEffect } from "react";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", "#0f0e0d");
  }, []);

  return <>{children}</>;
};