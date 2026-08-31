'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Sponsor() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [step, setStep] = useState(1);

  // ========================================================================
  // 1. SCROLL LENGTHS (CHECKPOINTS)
  // These decimals represent how far down the user has scrolled (0 to 1).
  // Tweak these decimals to make specific sections last longer or shorter!
  // ========================================================================
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    let nextStep = 1;
    if (latest < 0.15)
      nextStep = 1; // 0% - 15%: Slide 1
    else if (latest < 0.3)
      nextStep = 2; // 15% - 30%: Slide 2
    else if (latest < 0.45)
      nextStep = 3; // 30% - 45%: Full Screen 1
    else if (latest < 0.6)
      nextStep = 4; // 45% - 60%: Full Screen 2
    else if (latest < 0.8)
      nextStep = 5; // 60% - 80%: Full Screen 3
    else nextStep = 6; // 80% - 100%: Download Slide

    setStep((prev) => (prev !== nextStep ? nextStep : prev));
  });

  const transitionConfig = { duration: 0.8, ease: 'easeInOut' } as const;

  return (
    // Increased to 600vh to maintain smooth scrolling pacing with the new slide
    <section id="Sponsor" ref={containerRef} className="relative h-[600vh] bg-[#Fdfaf2] text-[#333] font-sans">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* HEADER VERTICAL POSITIONING */}
        <motion.div
          animate={{ opacity: step <= 2 ? 1 : 0 }}
          transition={transitionConfig}
          className="absolute top-24 md:top-32 left-0 right-0 z-50 flex justify-left px-8 md:px-24"
        >
          <h2 className="font-inter text-lg tracking-wider uppercase md:text-xl font-bold border-b-[3px] border-[#500000] text-[#500000] inline-block pb-2 px-4 tracking-wide">
            Sponsorship
          </h2>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="absolute font-poppins inset-x-0 z-10 top-[55%] -translate-y-1/2">
          {/* --- Slide 1: Image Right --- */}
          <motion.div
            animate={{
              x: step === 1 ? '0vw' : '50vw',
              opacity: step === 1 ? 1 : 0,
            }}
            transition={transitionConfig}
            className="absolute inset-0 flex flex-col md:flex-row items-center gap-10 pl-8 md:pl-24"
          >
            <div className="flex-1 flex items-center justify-center w-full pr-8 md:pr-0">
              <p className="text-2xl md:text-3xl lg:text-4xl text-center font-light leading-loose px-4">
                Ready to invest in the next
                <br className="hidden lg:block" /> generation of diverse tech leaders?
              </p>
            </div>
            <div className="flex-1 relative h-80 md:h-[450px] w-full rounded-l-3xl overflow-hidden shadow-md">
              <Image src="/CSGroupPhoto1.jpg" alt="ColorStack group" fill className="object-cover object-bottom" />
            </div>
          </motion.div>

          {/* --- Slide 2: Image Left --- */}
          <motion.div
            animate={{
              x: step < 2 ? '-50vw' : step === 2 ? '0vw' : '50vw',
              opacity: step === 2 ? 1 : 0,
            }}
            transition={transitionConfig}
            className="absolute inset-0 flex flex-col-reverse md:flex-row items-center gap-10 pr-8 md:pr-24 pointer-events-none"
          >
            <div className="flex-1 relative h-80 md:h-[450px] w-full rounded-r-3xl overflow-hidden shadow-md">
              <Image src="/CSGroupPhoto2.jpg" alt="Students talking" fill className="object-cover" />
            </div>
            <div className="flex-1 flex items-center justify-center w-full pl-8 md:pl-0">
              <p className="text-2xl md:text-3xl lg:text-4xl text-center font-light leading-relaxed px-4">
                Build a strong community of
                <br className="hidden lg:block" /> motivated students with
                <br className="hidden lg:block" /> technical skills and career-ready
                <br className="hidden lg:block" /> experience!
              </p>
            </div>
          </motion.div>
        </div>

        {/* --- Slide 3a: Full Screen 1 --- */}
        <motion.div
          animate={{
            y: step < 3 ? '100vh' : '0vh',
            opacity: step > 3 ? 0 : 1,
          }}
          transition={transitionConfig}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          <Image src="/DuoPic1.jpg" alt="Officers Posing" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 transition-colors duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white font-lora text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center px-6 drop-shadow-md leading-relaxed">
              Host targeted recruiting events on
              <br /> campus or virtually
            </h3>
          </div>
        </motion.div>

        {/* --- Slide 3b: Full Screen Placeholder 1 --- */}
        <motion.div
          animate={{ opacity: step === 4 ? 1 : 0 }}
          transition={transitionConfig}
          className="absolute inset-0 z-30 pointer-events-none"
        >
          <Image src="/CSGroupPhoto1.jpg" alt="Placeholder 1" fill className="object-cover object-bottom" />
          <div className="absolute inset-0 bg-black/60 transition-colors duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white font-lora text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center px-6 drop-shadow-md leading-relaxed">
              Connect directly with rising
              <br /> tech talent
            </h3>
          </div>
        </motion.div>

        {/* --- Slide 3c: Full Screen Placeholder 2 --- */}
        <motion.div
          animate={{ opacity: step === 5 ? 1 : 0 }}
          transition={transitionConfig}
          className="absolute inset-0 z-40 pointer-events-none"
        >
          <Image src="/CSGroupPhoto2.jpg" alt="Placeholder 2" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/60 transition-colors duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white font-lora text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center px-6 drop-shadow-md leading-relaxed">
              Help shape the future of
              <br /> tech diversity
            </h3>
          </div>
        </motion.div>

        {/* --- Slide 4: Final Download Screen --- */}
        <motion.div
          animate={{ opacity: step === 6 ? 1 : 0 }}
          transition={transitionConfig}
          // IMPORTANT: Pointer events must be dynamic here. When not on step 6, they are 'none' so you don't accidentally click the invisible button while on earlier slides.
          className={`absolute inset-0 z-50 flex items-center justify-center bg-[#500000] ${step === 6 ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <div className="text-center px-6 flex flex-col items-center justify-center max-w-4xl">
            <h3 className="text-[#FAF3E0] font-lora text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-md leading-relaxed mb-6">
              Ready to make an impact?
            </h3>

            <p className="text-white/90 font-poppins text-lg md:text-xl mb-10 leading-relaxed">
              Download our sponsorship packet to explore partnership tiers, core benefits, and learn how your
              organization can support TAMU ColorStack.
            </p>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/TAMU_ColorStack_Corporate_Sponsorship.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FCB432] text-[#500000] font-poppins font-bold text-lg md:text-xl px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Download Sponsorship Packet
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
