import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-neutral-800 py-12 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="logo2.png"
                alt="PeSofts Logo"
                className="h-8 w-auto object-contain rounded-xl "
              />
            </Link>
            <p className="text-sm text-neutral-400 max-w-xs">
              Empowering institutions and educators with secure, scaleable, and intuitive online examination and assessment software.
            </p>
          </div>

          {/* Links Col 1: Product */}
          <div>
            <h5 className="font-semibold text-sm text-white uppercase tracking-wider mb-4">Product</h5>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <a href="https://pesofts.com/online-examination-software.html" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  Online Exam Software
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/ai-proctoring-software.html" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  AI Proctoring
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/cbt-software.html" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  Computer Based Testing
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/question-bank-software.html" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  Question Bank Creator
                </a>
              </li>
            </ul>
          </div>

          {/* Links Col 2: Platform */}
          <div>
            <h5 className="font-semibold text-sm text-white uppercase tracking-wider mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/knowledge-base" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/docs" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  Product Docs
                </Link>
              </li>
              <li>
                <Link href="/community" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 3: Company */}
          <div>
            <h5 className="font-semibold text-sm text-white uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <a href="https://pesofts.com/about.html" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/contact.html" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/terms.html" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} PeSofts. All rights reserved.
          </p>
          <p className="text-sm text-neutral-600 mt-2 md:mt-0">
            Developed as a Knowledge Platform MVP.
          </p>
        </div>
      </div>
    </footer>
  );
};
