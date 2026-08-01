import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-pesofts-gray-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-pesofts-red text-white w-6 h-6 rounded-md flex items-center justify-center font-extrabold text-sm">
                P
              </div>
              <span className="font-bold text-base text-pesofts-gray-900">PeSofts</span>
            </div>
            <p className="text-sm text-pesofts-gray-400 max-w-xs">
              Empowering institutions and educators with secure, scaleable, and intuitive online examination and assessment software.
            </p>
          </div>

          {/* Links Col 1: Product */}
          <div>
            <h5 className="font-semibold text-sm text-pesofts-gray-800 uppercase tracking-wider mb-4">Product</h5>
            <ul className="space-y-2 text-sm text-pesofts-gray-500">
              <li>
                <a href="https://pesofts.com/online-examination-software.html" className="hover:text-pesofts-red transition-colors">
                  Online Exam Software
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/ai-proctoring-software.html" className="hover:text-pesofts-red transition-colors">
                  AI Proctoring
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/cbt-software.html" className="hover:text-pesofts-red transition-colors">
                  Computer Based Testing
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/question-bank-software.html" className="hover:text-pesofts-red transition-colors">
                  Question Bank Creator
                </a>
              </li>
            </ul>
          </div>

          {/* Links Col 2: Platform */}
          <div>
            <h5 className="font-semibold text-sm text-pesofts-gray-800 uppercase tracking-wider mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-pesofts-gray-500">
              <li>
                <Link href="/knowledge-base" className="hover:text-pesofts-red transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <span className="text-pesofts-gray-300 cursor-not-allowed">Product Docs</span>
              </li>
              <li>
                <span className="text-pesofts-gray-300 cursor-not-allowed">Academy Classes</span>
              </li>
              <li>
                <span className="text-pesofts-gray-300 cursor-not-allowed">Community Forum</span>
              </li>
            </ul>
          </div>

          {/* Links Col 3: Company */}
          <div>
            <h5 className="font-semibold text-sm text-pesofts-gray-800 uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2 text-sm text-pesofts-gray-500">
              <li>
                <a href="https://pesofts.com/about.html" className="hover:text-pesofts-red transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/contact.html" className="hover:text-pesofts-red transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/privacy-policy.html" className="hover:text-pesofts-red transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://pesofts.com/terms.html" className="hover:text-pesofts-red transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pesofts-gray-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-pesofts-gray-400">
            © {new Date().getFullYear()} PeSofts. All rights reserved.
          </p>
          <p className="text-sm text-pesofts-gray-300 mt-2 md:mt-0">
            Developed as a Knowledge Platform MVP.
          </p>
        </div>
      </div>
    </footer>
  );
};
