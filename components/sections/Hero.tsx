"use client";

import Image from "next/image";

const sponsors = [
  { name: "Hewlett Packard Enterprise", logo: "/sponsors/hpeLogo.png", size: "h-10 w-36 md:h-12 md:w-48" },
  { name: "NVIDIA", logo: "/sponsors/nvidia.png", size: "h-6 w-24 md:h-8 md:w-32" },
  { name: "Capital One", logo: "/sponsors/Capital_One-Logo.wine.svg", size: "h-10 w-36 md:h-16 md:w-52" },
  { name: "Bloomberg", logo: "/sponsors/bloomberg_Logo.png", size: "h-6 w-24 md:h-8 md:w-32" },
];

const column1Photos = [
  { src: "/club_images/55099514008_629b10960c_b.jpg", position: "object-center", borderColor: "bg-white" },
  { src: "/club_images/color_stack_team.jpg", position: "object-center", borderColor: "bg-white" },
  { src: "/club_images/54897352614_d780b196e2_b.jpg", position: "object-center", borderColor: "bg-white" },
  { src: "/club_images/54941721517_6c307bf325_b.jpg", position: "object-center", borderColor: "bg-white" },
];

const column2Photos = [
  { src: "/club_images/54942797473_0a74b0c57a_b.jpg", position: "object-[10%_center]", borderColor: "bg-white" },
  { src: "/club_images/55099573264_2e97738fc8_b.jpg", position: "object-center", borderColor: "bg-white" },
  { src: "/club_images/54897411990_aef0fea0ee_b.jpg", position: "object-center", borderColor: "bg-white" },
  { src: "/club_images/color_stack_team.jpg", position: "object-center", borderColor: "bg-white" },
];

export default function Hero() {


  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col bg-[#500000] overflow-hidden">
      {/* Main split content area */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto relative z-10">
        {/* Left Text Box */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-0 pt-24 lg:pt-0 z-20 text-center">
          <p
            className="text-[#E8A820] text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 animate-fade-in-up opacity-0"
            style={{ animationFillMode: 'forwards' }}
          >
            About Us
          </p>

          <h1
            className="font-lora text-[clamp(2rem,min(5vw,7vh),5.5rem)] text-white font-medium leading-[1.2] mb-4 md:mb-8 animate-fade-in-up opacity-0 drop-shadow-xl"
            style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
          >
            Helping Black and Latinx Computer Science students get{' '}
            <span className="text-[#E8A820] italic font-semibold">degreed</span> and{' '}
            <span className="text-[#E8A820] italic font-semibold">hired</span> nationwide.
          </h1>
          
          <div
            className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up opacity-0 cursor-pointer"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSd7XhHese9Nl5zMt3_j6fbc_5f-KT7UIxPFH2HF5cJDGDqJ2A/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#E8A820] text-[#500000] text-base font-bold rounded-full hover:bg-[#d4991c] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(232,168,32,0.3)] hover:shadow-[0_0_30px_rgba(232,168,32,0.5)]"
            >
              Become a Member
            </a>
          </div>
        </div>

        {/* Right Moving Collage Area */}
        <div
          className="w-full lg:w-1/2 h-[50vh] lg:h-auto lg:absolute lg:right-0 lg:top-0 lg:bottom-0 relative overflow-hidden mt-12 lg:mt-0 flex justify-center lg:justify-end lg:pr-12 xl:pr-24 gap-4 sm:gap-6 animate-fade-in-up opacity-0 pointer-events-none"
          style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
        >
          {/* Gradient overlays*/}
          <div className="absolute inset-x-0 top-0 h-24 lg:h-32 bg-gradient-to-b from-[#500000] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 lg:h-32 bg-gradient-to-t from-[#500000] to-transparent z-20 pointer-events-none" />

          {/* Scrolling Column 1 */}
          <div className="w-[140px] sm:w-[220px] xl:w-[260px] animate-scroll-y-down gap-6 pt-12 items-center pointer-events-auto">
            {[...column1Photos, ...column1Photos, ...column1Photos].map((photo, idx) => (
              <div
                key={`col1-${idx}`}
                className={`relative w-full aspect-[4/3] ${photo.borderColor} p-1 md:p-1.5 shadow-2xl mb-8 transform -rotate-3 hover:scale-105 hover:rotate-0 hover:z-30 transition-all duration-300 cursor-pointer pointer-events-auto rounded-sm hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.8)]`}
              >
                <div className="relative w-full h-full bg-gray-200 overflow-hidden">
                  <Image src={photo.src} alt="Club Photo" fill className={`object-cover ${photo.position}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Scrolling Column 2 */}
          <div className="w-[140px] sm:w-[220px] xl:w-[260px] animate-scroll-y-down-slow gap-6 pt-0 items-center pointer-events-auto">
            {[...column2Photos, ...column2Photos, ...column2Photos].map((photo, idx) => (
              <div
                key={`col2-${idx}`}
                className={`relative w-full aspect-[3/4] ${photo.borderColor} p-1 md:p-1.5 shadow-2xl mb-8 transform rotate-3 hover:scale-105 hover:rotate-0 hover:z-30 transition-all duration-300 cursor-pointer pointer-events-auto rounded-sm hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.8)]`}
              >
                <div className="relative w-full h-full bg-gray-200 overflow-hidden">
                  <Image src={photo.src} alt="Club Photo" fill className={`object-cover ${photo.position}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsors Strip */}
      <div
        className="w-full relative z-40 animate-fade-in-up opacity-0 mt-auto"
        style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
      >
        <div className="w-full flex justify-center mb-2">
          <p className="text-[#d89613] text-sm font-bold uppercase tracking-[0.3em] opacity-90">Supported By</p>
        </div>

        {/* White scroll banner */}
        <div className="bg-[#F8F9FA] h-16 md:h-16 flex items-center overflow-hidden w-full relative shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#F8F9FA] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10 pointer-events-none" />

          <div className="flex items-center gap-16 md:gap-32 animate-scroll w-max pl-8">
            {/* Duplicating the sponsors to create an infinite loop */}
            {[...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, idx) => (
              <div
                key={`${sponsor.name}-${idx}`}
                className={`relative ${sponsor.size} transition-transform duration-300 hover:scale-110 filter grayscale hover:grayscale-0`}
              >
                <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}