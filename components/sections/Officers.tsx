'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

export default function Officers() {
  const officers = [
    {
      name: 'Nicholas Matias',
      role: 'President',
      likes: 'Computer Science',
      dislikes: '2026',
      hobbies: 'The Other',
      image: '/officers/nick.jpg',
    },
    {
      name: 'Diego Landeata Torres',
      role: 'Vice-President',
      likes: 'Computer Science',
      dislikes: '2026',
      hobbies: 'The Other',
      image: '/officers/diego.jpg',
    },
    {
      name: 'Axel Fontaine',
      role: 'Treasurer',
      likes: 'Computer Science',
      dislikes: '2027',
      hobbies: 'The Other',
      image: '/officers/axel.jpg',
    },
    {
      name: 'Adam Vasquez',
      role: 'Secretary',
      likes: 'Computer Science',
      dislikes: '2027',
      hobbies: 'The Other',
      image: '/officers/adam.jpg',
    },
    {
      name: 'Steven Zapata',
      role: 'Communications Chair',
      likes: 'Electrical Engineering',
      dislikes: '2027',
      hobbies: 'The Other',
      image: '/officers/steven.jpg',
    },
    {
      name: 'Romina Cruz',
      role: 'Membership Chair',
      likes: 'Electrical Engineering',
      dislikes: '2027',
      hobbies: 'The Other',
      image: '/officers/romina.jpg',
    },
  ];

  const scrollRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    setIsAtTop(scrollTop <= 5);
    setIsAtBottom(Math.ceil(scrollTop + clientHeight) >= scrollHeight - 5);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkScroll();
      setIsMounted(true);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section id="Officers" className="w-full bg-[#500000]">
      <div className="mx-auto max-w-6xl px-1 py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-stretch">
          <div className="relative flex-1 w-full max-w-4xl h-[600px]">
            <AnimatePresence>
              {isMounted && !isAtTop && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-none absolute top-0 left-0 right-4 h-24 bg-gradient-to-b from-[#500000] to-transparent z-10"
                />
              )}
            </AnimatePresence>

            <div ref={scrollRef} onScroll={checkScroll} className="h-full overflow-y-auto pr-4 space-y-6 no-scrollbar">
              {officers.map((o) => (
                <div key={o.name} className="flex justify-between bg-[#FAF3E0] shadow-lg overflow-hidden">
                  
                  <div className="flex-1 py-6 pl-6 pr-4">
                    <h3 className="font-lora text-2xl font-bold text-[#000000]">{o.name}</h3>
                    <p className="font-poppins font-medium uppercase tracking-wider text-sm text-[#000000]/70">
                      {o.role}
                    </p>
                    <div className="mt-4 font-poppins text-[#000000] space-y-1">
                      <p>Major: {o.likes}</p>
                      <p>Class Year: {o.dislikes}</p>
                    </div>
                  </div>

                  <div className="relative w-1/4 shrink-0 bg-[#000000]">
                    <Image
                      src={o.image}
                      alt={`${o.name}'s profile picture`}
                      fill
                      className="object-cover"
                      sizes="500px"
                    />
                  </div>
                  
                </div>
              ))}
            </div>

            <AnimatePresence>
              {isMounted && !isAtBottom && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-none absolute bottom-0 left-0 right-4 h-32 bg-gradient-to-t from-[#500000] to-transparent z-10"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col font-inter justify-center text-[#FFFFFF] lg:w-[450px] shrink-0">
            <h2 className="text-4xl font-semibold underline underline-offset-8 font-poppins">Our Officers</h2>
            <p className="mt-8 leading-relaxed">
              Led by a passionate team of TAMU ColorStack officers, our chapter serves as a local hub of the national
              ColorStack network, creating pathways for students of color in computing to succeed, connect, and lead.
              Officers collaborate to host workshops, tech-building sessions, and networking events that equip members
              for internships and full-time roles in tech.
            </p>
            <p className="mt-6 leading-relaxed">
              Our officers strive to cultivate a welcoming and empowering community where every member feels seen,
              supported, and encouraged to reach their full potential in tech at Texas A&M. By advocating for students
              of color in computing and building strong relationships with both campus and industry partners, they help
              ensure that TAMU ColorStack reflects the core values of its members.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
