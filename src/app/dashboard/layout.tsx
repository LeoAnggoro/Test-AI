import React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-charcoal overflow-hidden text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 relative">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-volt/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        {children}
      </main>
    </div>
  );
}
