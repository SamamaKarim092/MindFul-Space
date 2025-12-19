"use client";

import { useState } from "react";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";

const font = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-6">
        <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-white/20 bg-white/10 px-6 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.55)] backdrop-blur-3xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="text-white/80 transition hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span
                className={`${font.className} text-xl font-bold text-white`}
              >
                🧠 MindJournal
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed bottom-0 left-0 top-0 z-[70] w-64 border-r border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className={`${font.className} text-xl font-bold text-white`}>
            MindJournal
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/60 transition hover:text-white"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <Link
            href="#features"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-white/80 transition hover:text-white"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-white/80 transition hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-white/80 transition hover:text-white"
          >
            About
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
