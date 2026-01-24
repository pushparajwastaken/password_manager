"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
