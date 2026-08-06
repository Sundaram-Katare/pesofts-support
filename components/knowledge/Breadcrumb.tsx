import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-pesofts-gray-500 ${className}`} aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center hover:text-orange-600 transition-colors duration-150"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-4 w-4 text-pesofts-gray-300 flex-shrink-0" />
            {isLast ? (
              <span className="font-medium text-pesofts-gray-800 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-orange-600 transition-colors duration-150"
              >
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
