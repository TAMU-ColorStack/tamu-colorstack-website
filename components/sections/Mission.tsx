"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type MissionMode = "national" | "local";
type GlowTone = "teal" | "gold";

type MissionPanel = {
  title: string;
  nationalText: string;
  localText: string;
  nationalImage: string;
  localImage: string;
};

const panels: MissionPanel[] = [
  {
    title: "Mission",
    nationalText:
      "Increase the number of Black and Latinx Computer Science graduates that go on to launch rewarding technical careers.",
    localText:
      "Empower local students at Texas A&M with a community-driven safety net that cultivates academic and professional success.",
    nationalImage: "/colorstackphotos/67133ca88dea988c2acca64c_summit group photo-p-800.jpg",
    localImage: "/colorstackfotos/dsc_0389_55099669310_l.jpg",
  },
  {
    title: "Strategy",
    nationalText:
      "Organizing a portfolio of tools, resources, and opportunities to ensure that every member is equipped to complete their degree and land a full-time, technical job.",
    localText:
      "Providing weekly workshops, personalized resume reviews, and direct networking events with top tech companies specific to our chapter.",
    nationalImage: "/colorstackphotos/68c1cb3b1516208023cf476b_b779388b-58bd-4b5e-8aab-21f343cf03b0-p-1080.jpg",
    localImage: "/colorstackfotos/dsc_0377_55099299156_l.jpg",
  },
  {
    title: "Vision",
    nationalText: "A future where Black and Latinx technologists are at the forefront of innovation.",
    localText:
      "A thriving pipeline of diverse leaders emerging from Texas A&M and redefining the landscape of the tech industry.",
    nationalImage: "/colorstackphotos/68fb3f5f196adc779393ca0b_Header - Stacked-Up-Summit-D1-Chloe-Jackman-Photography-2025-3117_websize.jpg",
    localImage: "/colorstackfotos/dsc_0423_55099573374_l.jpg",
  },
];

const modeConfig = {
  national: {
    label: "National",
    logo: "/logos/colorstack_national.jpg",
    buttonTone: "teal",
    card: "bg-[#0e1524]",
    cardBorder: "border-[#2a4d6a]",
    headingText: "text-[#eaf6f4]",
    bodyText: "text-[#cfe3e0]",
    accent: "bg-[#f2b53b]",
  },
  local: {
    label: "Texas A&M",
    logo: "/logos/colorstack_tamu.png",
    buttonTone: "gold",
    card: "bg-[#6a0709]",
    cardBorder: "border-[#9f5758]",
    headingText: "text-[#fff4e0]",
    bodyText: "text-[#f1ddc1]",
    accent: "bg-[#f2b53b]",
  },
} satisfies Record<
  MissionMode,
  {
    label: string;
    logo: string;
    buttonTone: GlowTone;
    card: string;
    cardBorder: string;
    headingText: string;
    bodyText: string;
    accent: string;
  }
>;

const glowPalette = {
  teal: { glow: "#3dbfb8" },
  gold: { glow: "#f0b429" },
} satisfies Record<GlowTone, { glow: string }>;

function TiltGlowLogoButton({
  alt,
  isActive,
  onClick,
  src,
  tone,
}: {
  alt: string;
  isActive: boolean;
  onClick: () => void;
  src: string;
  tone: GlowTone;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const glow = glowPalette[tone].glow;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={alt}
      aria-pressed={isActive}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;

        rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 20);
        rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 20);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      onBlur={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      animate={{
        y: isActive ? -4 : 0,
      }}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      data-glow-button="true"
      className="m-0 flex appearance-none items-center justify-center border-0 bg-transparent p-0 leading-none focus-visible:outline-none"
    >
      <motion.div
        variants={{
          hover: {
            scale: 1.06,
            filter: `drop-shadow(0 14px 28px ${glow}aa) drop-shadow(0 0 18px ${glow}80)`,
          },
        }}
        animate={{
          filter: isActive
            ? `drop-shadow(0 12px 24px ${glow}cc) drop-shadow(0 0 14px ${glow}80)`
            : `drop-shadow(0 0 0 ${glow}00)`,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="inline-block"
      >
        <Image
          src={src}
          alt={alt}
          width={116}
          height={116}
          sizes="(max-width: 640px) 84px, 116px"
          data-glow-logo="true"
          className={`block object-contain transition-opacity duration-300 ${
            isActive
              ? "h-[84px] w-[84px] opacity-100 sm:h-[116px] sm:w-[116px]"
              : "h-[84px] w-[84px] opacity-78 sm:h-[116px] sm:w-[116px]"
          }`}
        />
      </motion.div>
    </motion.button>
  );
}

export default function Mission() {
  const [mode, setMode] = useState<MissionMode>("national");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const config = modeConfig[mode];

  return (
    <section
      ref={sectionRef}
      id="Mission"
      className="font-poppins relative w-full overflow-hidden bg-[#0e1524] px-4 pb-16 pt-8 text-white sm:px-8 sm:pb-[4.5rem] sm:pt-10 lg:px-12 lg:pb-20 lg:pt-12"
    >
      <div className="wm font-lora" aria-hidden="true">
        <div className="wm-row wm-scroll-left">
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-right">
          <span className="wm-track">Mission&nbsp;·&nbsp;Strategy&nbsp;·&nbsp;Vision&nbsp;·&nbsp;</span>
          <span className="wm-track">Mission&nbsp;·&nbsp;Strategy&nbsp;·&nbsp;Vision&nbsp;·&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-left">
          <span className="wm-track">Texas&nbsp;A&amp;M&nbsp;·&nbsp;Texas&nbsp;A&amp;M&nbsp;·&nbsp;</span>
          <span className="wm-track">Texas&nbsp;A&amp;M&nbsp;·&nbsp;Texas&nbsp;A&amp;M&nbsp;·&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-right">
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-left">
          <span className="wm-track">Mission&nbsp;·&nbsp;Strategy&nbsp;·&nbsp;Vision&nbsp;·&nbsp;</span>
          <span className="wm-track">Mission&nbsp;·&nbsp;Strategy&nbsp;·&nbsp;Vision&nbsp;·&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-right">
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-left">
          <span className="wm-track">Texas&nbsp;A&amp;M&nbsp;·&nbsp;Texas&nbsp;A&amp;M&nbsp;·&nbsp;</span>
          <span className="wm-track">Texas&nbsp;A&amp;M&nbsp;·&nbsp;Texas&nbsp;A&amp;M&nbsp;·&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-right">
          <span className="wm-track">Mission&nbsp;·&nbsp;Strategy&nbsp;·&nbsp;Vision&nbsp;·&nbsp;</span>
          <span className="wm-track">Mission&nbsp;·&nbsp;Strategy&nbsp;·&nbsp;Vision&nbsp;·&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-left">
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-right">
          <span className="wm-track">Texas&nbsp;A&amp;M&nbsp;·&nbsp;Texas&nbsp;A&amp;M&nbsp;·&nbsp;</span>
          <span className="wm-track">Texas&nbsp;A&amp;M&nbsp;·&nbsp;Texas&nbsp;A&amp;M&nbsp;·&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-left">
          <span className="wm-track">Mission&nbsp;·&nbsp;Strategy&nbsp;·&nbsp;Vision&nbsp;·&nbsp;</span>
          <span className="wm-track">Mission&nbsp;·&nbsp;Strategy&nbsp;·&nbsp;Vision&nbsp;·&nbsp;</span>
        </div>
        <div className="wm-row wm-scroll-right">
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
          <span className="wm-track">ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;ColorStack&nbsp;</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:mb-8 md:flex-row md:items-center md:pt-10">
          <div
            className={`max-w-xl text-center md:text-left ${isVisible ? 'animate-fade-in-up opacity-0' : 'opacity-0'}`}
            style={{ animationFillMode: 'forwards' }}
          >
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#f2b53b] sm:text-[0.72rem] sm:tracking-[0.32em]">
              What We Do
            </p>
            <h2 className="font-lora font-medium text-[2.5rem] leading-[0.95] text-white sm:text-[3rem] md:text-[3.7rem]">
              {mode === 'national'
                ? "ColorStack's mission at the national level."
                : 'How the mission comes to life in our local chapter.'}
            </h2>
          </div>

          <div
            className={`grid w-full max-w-[18rem] grid-cols-2 justify-center gap-4 self-center sm:max-w-[20rem] md:w-auto md:max-w-none md:self-start ${
              isVisible ? 'animate-fade-in-up opacity-0' : 'opacity-0'
            }`}
            style={{ animationDelay: '120ms', animationFillMode: 'forwards' }}
          >
            {(['national', 'local'] as MissionMode[]).map((view) => {
              const isActive = mode === view;
              const viewConfig = modeConfig[view];

              return (
                <TiltGlowLogoButton
                  key={view}
                  alt={`${viewConfig.label} logo`}
                  isActive={isActive}
                  onClick={() => setMode(view)}
                  src={viewConfig.logo}
                  tone={viewConfig.buttonTone}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {panels.map((panel, idx) => (
            <article
              key={`${mode}-${panel.title}`}
              className={`relative overflow-hidden rounded-[1rem] border p-5 sm:rounded-[1.2rem] sm:p-6 md:min-h-[330px] md:p-8 ${
                mode === 'national' ? `${config.card} ${config.cardBorder}` : 'border-white/18 bg-[#500000]'
              } ${isVisible ? 'animate-fade-in-up opacity-0' : 'opacity-0'}`}
              style={{ animationDelay: `${220 + idx * 120}ms`, animationFillMode: 'forwards' }}
            >
              {mode === 'local' ? (
                <>
                  <div className="absolute inset-0">
                    <Image
                      src={panel.localImage}
                      alt={`${panel.title} local chapter background`}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[#500000]/72" />
                  <div className="absolute inset-0 bg-black/18" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0">
                    <Image
                      src={panel.nationalImage}
                      alt={`${panel.title} national background`}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[#0e1524]/72" />
                  <div className="absolute inset-0 bg-black/22" />
                </>
              )}

              <div className="relative z-10">
                <span className={`mb-5 block h-1.5 w-14 rounded-full sm:mb-6 sm:w-16 ${config.accent}`} />

                <h3
                  className={`font-lora font-medium mb-4 text-[2rem] leading-none sm:mb-5 sm:text-[2.4rem] ${config.headingText}`}
                >
                  {panel.title}
                </h3>

                <p
                  className={`max-w-none text-[0.98rem] leading-7 sm:max-w-[28ch] sm:text-[1.02rem] sm:leading-8 ${config.bodyText}`}
                >
                  {mode === 'national' ? panel.nationalText : panel.localText}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
