import React from "react";
import { DocSidebar } from "@/components/docs/DocSidebar";
import { getDocCategoriesServer } from "@/lib/docsServer";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function DocsLayout({ children }: LayoutProps) {
  const categories = await getDocCategoriesServer();

  return (
    <div className="flex-grow flex flex-col bg-white min-h-[calc(100vh-4rem)]">
      <div className="max-w-8xl w-full mx-auto flex-grow flex">
        {/* Desktop Left Sidebar Panel */}
        <aside className="hidden md:block w-64 lg:w-72 border-r border-pesofts-gray-100 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
          <DocSidebar categories={categories} />
        </aside>

        {/* Core Content Area */}
        <main className="flex-grow flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
