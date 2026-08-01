import React from "react";
import { Cpu, Globe, ShieldCheck, Laptop, Database, FileText } from "lucide-react";

interface CategoryCardProps {
  name: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  count,
  isActive = false,
  onClick,
}) => {
  // Map category names to Lucide icons
  const getIcon = () => {
    const norm = name.toLowerCase();
    if (norm.includes("proctor")) return <Cpu className="w-5 h-5" />;
    if (norm.includes("online exam")) return <Globe className="w-5 h-5" />;
    if (norm.includes("security")) return <ShieldCheck className="w-5 h-5" />;
    if (norm.includes("computer") || norm.includes("cbt")) return <Laptop className="w-5 h-5" />;
    if (norm.includes("bank")) return <Database className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center p-4 rounded-xl border text-left transition-all duration-200 w-full ${
        isActive
          ? "border-pesofts-red bg-pesofts-red-50 text-pesofts-red"
          : "border-pesofts-gray-200 bg-white hover:border-pesofts-gray-300 text-pesofts-gray-800"
      }`}
    >
      <div
        className={`p-2.5 rounded-lg mr-4 ${
          isActive ? "bg-white text-pesofts-red shadow-sm" : "bg-pesofts-gray-50 text-pesofts-gray-500"
        }`}
      >
        {getIcon()}
      </div>
      <div>
        <h4 className="font-bold text-sm tracking-tight text-pesofts-gray-900 group-hover:text-pesofts-red transition-colors duration-150">
          {name}
        </h4>
        <p className={`text-xs ${isActive ? "text-pesofts-red-700" : "text-pesofts-gray-400"}`}>
          {count} {count === 1 ? "article" : "articles"}
        </p>
      </div>
    </button>
  );
};
