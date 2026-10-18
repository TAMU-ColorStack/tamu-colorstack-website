'use client';

import Image from "next/image";
import {useState, useEffect} from 'react';

import {motion, AnimatePresence} from "motion/react";

const members: string[][] = [
    ["/bag-secured/yahoo-svgrepo-com.svg", "Member 1", "/bag-secured/person-svgrepo-com.svg", "Jerimiaha H. Swanson", "Software Engineer Intern"],
    ["/bag-secured/netflix-svgrepo-com.svg", "Member 2", "/bag-secured/person3-svgrepo-com.svg", "Linda G. Watts", "Machine Learning Intern"],
    ["/bag-secured/visa-svgrepo-com.svg", "Member 3", "/bag-secured/person2-svgrepo-com.svg", "Ezra Langston", "Data Engineering Intern"]
];

function GenerateFlag(logo_src: string, alt_text: string, headshot_src: string, name: string, position: string, key?: number) {
    return (
        <a key={key} className="flex flex-row items-center justify-center gap-15 pt-[0px] w-[1000px] px-4">
            <Image src={logo_src} alt={alt_text} width={80} height={80}></Image>
        
            <div className="flex flex-col items-center">
                <p className="font-semibold text-[15px] pb-[10px]">{name}</p>
                <p className="italic text-[15px]">{position}</p>
            </div>

            <Image src={headshot_src} alt={alt_text} width={60} height={60}></Image>
            
        </a>
    );
}

export default function BagSecured() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % members.length);
        }, 3000); // change every 3 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-[#500000] pt-[20px] pb-[20px]">
            <div className="flex bg-[#3ca39b] w-full h-[100px] justify-center">
                <div className="flex flex-col text-center w-full">
                    <div className="flex flex-col h-[50px] pt-[15px] bg-[#3ca39b]">
                        <p className="font-semibold text-[15px] pb-[10px]">BAG SECURED</p>
                        <hr></hr>
                    </div>
                    <div className="flex flex-col pr-[20] items-center bg-[#3ca39b] h-[100px]">
                        <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 1}}
                        >
                            {GenerateFlag(members[index][0], members[index][1], members[index][2], members[index][3], members[index][4], index)}
                        </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};