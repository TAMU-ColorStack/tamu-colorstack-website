import Image from 'next/image';
import styles from './ImageHover.module.css';

/*icon 2d array storing links, image sources, and alt texts respectively*/
const icon_array: string[][] = [
  [
    'https://mail.google.com/mail/u/0/?view=cm&fs=1&to=tamucolorstack@gmail.com',
    '/email-svgrepo-com.svg',
    'ColorStack Email',
  ],
  ['https://discord.gg/ycCFTmcWh4', '/discord-svgrepo-com.svg', 'ColorStack Discord'],
  [
    'https://www.linkedin.com/company/tamucolorstack/posts/?feedView=all',
    '/linkedin-svgrepo-com.svg',
    'ColorStack LinkedIn',
  ],
  ['https://www.flickr.com/photos/tamucolorstack/albums', '/flickr-svgrepo-com.svg', 'ColorStack Flickr'],
  ['https://www.instagram.com/tamucolorstack/?hl=en', '/instagram-svgrepo-com.svg', 'ColorStack Instagram'],
  ['https://www.tiktok.com/@tamucolorstack', '/tiktok-svgrepo-com.svg', 'ColorStack TikTok'],
];

function AddIcon(link: string, img_src: string, alt_text: string, key?: number) {
  /*had to add a key for each object - #917c41*/
  return (
    /*must return the jsx object*/
    <a key={key} className="pr-[15px]" href={link} target="_blank" rel="noopener noreferrer">
      <Image src={img_src} alt={alt_text} width={25} height={25} className={styles.hoverImage}></Image>
    </a>
  );
}

export default function Footer() {
  return (
    <div id='Footer' className="flex flex-col w-full h-fit items-center font-poppins py-10">
      <h1 className="flex justify-center pb-[10px] underline text-underline-offset-[50px] decoration-[#ebbd34] font-bold">
        Connect with us!
      </h1>
      <div className="text-center pb-[10px] max-w-3/4">
        <p className="font-semibold h-1/3">
          Have questions or want to get involved with TAMU ColorStack? Connect with our officers, follow our updates,
          and join us at upcoming events to become part of our community.
        </p>
        <div className="pt-[15px] font-extralight">
          <p>Email: tamucolorstack@gmail.com</p>
          <p>Mailing Address: TAMU ColorStack</p>
          <p>Zachry Engineering Education Complex</p>
          <p>Texas A&M University</p>
          <p>College Station, Texas 77843-3127</p>
        </div>
      </div>
      <div className={styles.imageWrapper}>{icon_array.map((icon, i) => AddIcon(icon[0], icon[1], icon[2], i))}</div>
    </div>
  );
}
