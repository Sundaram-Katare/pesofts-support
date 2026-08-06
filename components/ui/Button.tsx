import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  href?: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  href,
  children,
  className = "",
  target,
  rel,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pesofts-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-pesofts-red text-white hover:bg-pesofts-red-600 border border-transparent shadow-sm",
    secondary:
      "bg-pesofts-gray-100 text-pesofts-gray-800 hover:bg-pesofts-gray-200 border border-transparent",
    outline:
      "bg-transparent text-pesofts-gray-700 hover:bg-pesofts-gray-50 border border-pesofts-gray-200",
    ghost: "bg-transparent text-pesofts-gray-600 hover:bg-pesofts-gray-100 hover:text-pesofts-gray-900",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
