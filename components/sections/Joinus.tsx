"use client";
import Image from "next/image";

type ScatteredImage = { src: string; id: number; top: string; left: string; width: string; height: number };

export default function JoinUs({ images }: { images: string[] }) {
  // Fixed positions mimicking the provided sample layout image
  // search next.js image types with react variables
  const imageData: ScatteredImage[] = [
    { src: "/joinus_backg/API_GBM.jpg", id: 0, top: "0%", left: "3%", width: "600", height: 230 },
    { src: "/joinus_backg/building_goals_GBM.jpg", id: 1, top: "100%", left: "5%", width: "600", height: 190 },
    { src: "/joinus_backg/colorstack_pic1.png", id: 2, top: "150%", left: "50%", width: "800", height: 140 },
    { src: "/joinus_backg/FALL_GBM.jpg", id: 3, top: "215%", left: "3%", width: "800", height: 190 },
    { src: "/joinus_backg/GOALS2_GBM.jpg", id: 4, top: "235%", left: "51%", width: "800", height: 210 },
    { src: "/joinus_backg/GOALS3_GBM.jpg", id: 5, top: "305%", left: "53%", width: "750", height: 180 },
    { src: "/joinus_backg/SPRING_INTRO_GBM.jpg", id: 6, top: "285%", left: "2%", width: "800", height: 210 },
    { src: "/joinus_backg/WEB_DEV2_GBM.jpg", id: 7, top: "355%", left: "1%", width: "830", height: 220 },
    { src: "/joinus_backg/WEB_DEV_GBM.jpg", id: 8, top: "370%", left: "56%", width: "720", height: 220 },
 ];

  return (
    <main className="relative w-screen min-h-screen bg-white">
      <h1 className="flex h-screen top-8 left-6 font-bold text-black text-4xl z-10 relative">
       
      </h1>

      {/* 3. Render the scattered images */}
      {imageData.map((img) => (
        <div
          key={img.id}
          className="absolute inline-block w-fit transition-opacity duration-500 shrink-0 "
          style={{ top: img.top, left: img.left, display: 'inline-flex'}}
        >
          <Image
            src={img.src}
            alt="Scattered element"
            width={img.width}
            height={img.height}
            className="object-cover shadow-lg"
          />
        </div>
      ))}
    </main>
  );
}