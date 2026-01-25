import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Dashboard layout wrapper */}
      {children}
    </section>
  );
}
