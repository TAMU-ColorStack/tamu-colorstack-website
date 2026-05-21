'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import '@/app/globals.css';

export default function Navbar() {
  const linkClass = 'text-white hover:text-[#FCB432] transition-colors duration-200 text-lg md:text-base';

  const [isScrolled, setisScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setisScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    // Changed "fixed" to "sticky" right here:
    <nav className="sticky font-poppins top-0 w-full bg-[#500000] z-50 shadow-md">
      <div className="flex items-center justify-between px-6 py-2 md:justify-center md:gap-12 lg:gap-16 md:px-0">
        <div className="hidden md:flex items-center gap-16 md:gap-10">
          <motion.a whileHover={{ scale: 1.05 }} href="#Mission" className={linkClass}>
            About Us
          </motion.a>
          <motion.a whileHover={{ scale: 1.05 }} href="#Footer" className={linkClass}>
            Get Involved
          </motion.a>
        </div>

        <div className="flex items-center">
          <a href="#top" onClick={closeMenu} className="shrink-0">
            <Image src="/tamucolorstacklogo.png" width={50} height={50} alt="colorstack info" />
          </a>
          <motion.div
            initial={{ maxWidth: 220, opacity: 1, scaleX: 1 }}
            className="flex font-medium text-2xl items-center gap-1 overflow-hidden origin-left whitespace-nowrap"
            animate={{
              scaleX: isScrolled ? 0 : 1,
              opacity: isScrolled ? 0 : 1,
              maxWidth: isScrolled ? 0 : 220,
            }}
            transition={{
              scaleX: { duration: 0.225, ease: 'easeInOut' },
              opacity: { duration: 0.15, delay: 0.2 },
              maxWidth: { duration: 0.45, ease: 'easeInOut' },
            }}
          >
            <h1 className="text-white ml-2">TAMU</h1>
            <h1 className="text-[#FCB432]">ColorStack</h1>
          </motion.div>
        </div>

        <div className="hidden md:flex items-center gap-16 md:gap-10">
          <motion.a whileHover={{ scale: 1.05 }} href="#Officers" className={linkClass}>
            Officers
          </motion.a>
          <motion.a whileHover={{ scale: 1.05 }} href="#Sponsor" className={linkClass}>
            Sponsorship
          </motion.a>
        </div>

        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden md:hidden bg-[#500000] border-t border-white/10"
          >
            <div className="flex flex-col items-center gap-6 py-6">
              <a href="#Mission" onClick={closeMenu} className={linkClass}>
                About Us
              </a>
              <a href="#Footer" onClick={closeMenu} className={linkClass}>
                Get Involved
              </a>
              <a href="#Officers" onClick={closeMenu} className={linkClass}>
                Officers
              </a>
              <a href="#Sponsor" onClick={closeMenu} className={linkClass}>
                Sponsorship
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
