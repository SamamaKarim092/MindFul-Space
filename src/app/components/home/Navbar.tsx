"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

const font = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const navShell = "border-slate-900/10 bg-white/72 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl";
  const navText = "text-slate-700 hover:text-slate-950";
  const brandText = "text-slate-950";
  const primaryCta = "rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800";
  const mobilePanel = "border-slate-900/10 bg-white/95";

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1.2,
          delay: isHome ? 1.4 : 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-6"
      >
        <div
          className={`flex w-full max-w-6xl items-center justify-between rounded-full border px-6 py-3 ${navShell}`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className={`transition md:hidden ${navText}`}
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
                className={`${font.className} text-xl font-bold ${brandText}`}
              >
                🧠 MindJournal
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium transition ${navText}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition ${navText}`}
            >
              About
            </Link>
            <Link
              href="https://github.com/SamamaKarim092/Mental-Health-Sentiment-Journal"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium flex items-center gap-1.5 transition ${navText}`}
            >
              <Github className="h-4 w-4" />
              Github
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={`text-sm font-medium transition ${navText}`}
            >
              Log in
            </Link>
            <Link href="/signup" className={primaryCta}>
              Sign up
            </Link>
          </div>
        </div>
      </motion.nav>

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
        className={`fixed bottom-0 left-0 top-0 z-[70] w-72 border-r p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 md:hidden ${mobilePanel} ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className={`${font.className} text-xl font-bold ${brandText}`}>
            MindJournal
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className={`transition ${navText}`}
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
            href="/"
            onClick={() => setIsOpen(false)}
            className={`text-lg font-medium transition ${navText}`}
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className={`text-lg font-medium transition ${navText}`}
          >
            About
          </Link>
          <Link
            href="https://github.com/SamamaKarim092/Mental-Health-Sentiment-Journal"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className={`text-lg font-medium flex items-center gap-2 transition ${navText}`}
          >
            <Github className="h-5 w-5" />
            Github
          </Link>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className={`text-base font-medium transition ${navText}`}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className={`${primaryCta} inline-flex w-fit items-center justify-center`}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
