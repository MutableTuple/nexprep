"use client";

import { useState } from "react";
import { Menu, X, Circle } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Work", href: "#" },
    { name: "About", href: "#" },
    { name: "Playground", href: "#" },
    { name: "Resources", href: "#" },
  ];

  return (
    <>
      <nav className="fixed top-6 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2">
        <div className="flex items-center justify-between rounded-full border border-neutral-700 bg-neutral-950/90 px-3 py-3 shadow-[0_15px_45px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          {/* Logo */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
            <Circle className="h-6 w-6 fill-black" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-12 text-[17px] font-medium text-white md:flex">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative transition hover:text-neutral-300 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Email Button */}
          <a
            href="mailto:ihyaet@gmail.com"
            className="hidden rounded-full bg-white px-7 py-3 text-base font-medium text-black transition hover:scale-105 md:block"
          >
            ihyaet@gmail.com
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-full bg-white p-3 text-black md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            open ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-lg text-white transition hover:bg-neutral-800"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <a
              href="mailto:ihyaet@gmail.com"
              className="mt-6 flex justify-center rounded-full bg-white py-3 font-medium text-black"
            >
              ihyaet@gmail.com
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
