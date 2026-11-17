'use client';

import Image from 'next/image';
import { useRef, useState, type FormEvent } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';



  

export default function Sponsor() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const fieldClass =
    'block w-full rounded-xl border border-white/20 bg-[#FAF3E0] px-4 py-2.5 text-base font-normal text-[#500000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCB432]';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/maeoebgv', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fields,
      });

      if (!response.ok) {
        setStatus('error');
        return;
      }

      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  // 1. Define state with type inference (implicitly typed as string)
  const [textValue, setTextValue] = useState<string>('');
  // 2. Strongly type the change event handler
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

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
    else if (latest < 0.75)
      nextStep = 5; // 60% - 80%: Full Screen 3
    else if (latest < 0.9)
      nextStep = 6; // 80% - 90%: Download Slide
    else nextStep = 7; // 90% - 100%: Contact Info Page

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
        {/* --- Slide 5: Sponsor Reach Out-FORM --- */}
        <motion.div
          animate={{ opacity: step === 7 ? 1 : 0 }}
          transition={transitionConfig}
          aria-hidden={step !== 7}
          className={`absolute inset-0 z-50 overflow-y-auto bg-[#500000] ${
            step === 7 ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="flex min-h-full flex-col justify-center px-5 py-8 sm:px-8">
            <form
              onSubmit={handleSubmit}
              aria-labelledby="sponsor-contact-title"
              className="mx-auto w-full max-w-[42rem] font-poppins"
            >
              <h3
                id="sponsor-contact-title"
                className="mb-5 text-center font-lora text-3xl font-bold text-[#FCB432] sm:text-4xl"
              >
                Reach Out to Us
              </h3>

              <fieldset
                disabled={step !== 7 || status === 'sending'}
                className="min-w-0 space-y-3 border-0 p-0 text-sm font-medium text-[#FAF3E0]"
              >
                <label className="block space-y-1">
                  <span>Sponsor Name</span>
                  <input name="name" autoComplete="name" required className={fieldClass} />
                </label>

                <label className="block space-y-1">
                  <span>Company / Organization</span>
                  <input
                    name="company"
                    autoComplete="organization"
                    required
                    className={fieldClass}
                  />
                </label>

                <label className="block space-y-1">
                  <span>Company Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    className={fieldClass}
                  />
                </label>

                <label className="block space-y-1">
                  <span>Subject</span>
                  <input name="subject" required className={fieldClass} />
                </label>

                <label className="block space-y-1">
                  <span>Message</span>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className={`${fieldClass} resize-y`}
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#FCB432] px-5 py-3 text-base font-bold text-[#500000] hover:bg-[#ffd16d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCB432] disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
              </fieldset>

              <p role="status" className="mt-2 text-center text-sm text-[#FAF3E0]">
                {status === 'sent' && 'Thanks for reaching out to TAMU ColorStack!'}
                {status === 'error' && 'Your message could not be sent. Please try again.'}
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
