'use client';

// import Image from "next/image";
import { useEffect, useState } from 'react';
import DislikeIcon from '../../ui/icons/DislikeIcon';
import LikeIcon from '../../ui/icons/LikeIcon';
import AboutProfile from './AboutProfile';

export default function Page({ pictures }: { pictures: string[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [shadowColor, setShadowColor] = useState('rgba(0,0,0,0.5)'); // Default shadow color

    const extractDominantColor = (src) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const pixel = ctx.getImageData(img.width / 2, img.height / 2, 1, 1).data;
            const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 0.5)`;
            setShadowColor(color);
        };
    };

    useEffect(() => {
        extractDominantColor(pictures[activeIndex]);
    }, [activeIndex]);

    const nextSlide = () => setActiveIndex((current) => (current + 1) % pictures.length);
    const prevSlide = () => setActiveIndex((current) => (current - 1 + pictures.length) % pictures.length);

    return (
        <div id="userCarousel">
            <div className="relative overflow-hidden rounded-lg" style={{ width: '100%', height: '0', paddingBottom: '100%', boxShadow: `0 0px 1000000px ${shadowColor}`, transition: 'box-shadow 0.5s ease', }}>
                {pictures.map((src, index) => (
                    <div key={index} className={`selectDisable carousel-image ${index === activeIndex ? 'active' : ''} absolute inset-0 w-full h-full flex justify-center items-center`}>
                        {/* Adjust the img tag below for better responsiveness and fitting */}
                        <img className='selectDisable' src={src} alt={`Slide ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div className='absolute bottom-0 w-full pb-4 pl-4'>
                            <h1 className="text-xl font-bold text-white">Ayoub Amzil - 24</h1>
                            <h2 className="text-sm font-bold text-white">30Km</h2>
                        </div>
                    </div>
                ))}
                {pictures.length > 1 && (
                    <>
                        <button id="carouselPrev" onClick={prevSlide} type="button" className="group absolute left-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
                                <svg className="h-4 w-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                                </svg>
                                <span className="hidden">Previous</span>
                            </span>
                        </button>
                        <button id="carouselNext" onClick={nextSlide} type="button" className="group absolute right-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70" >
                                <svg className="h-4 w-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <span className="hidden">Next</span>
                            </span>
                        </button>
                    </>)}
            </div>
            <div className="flex justify-center space-x-2 mt-6">
                {pictures.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`h-2 w-6 rounded-full ${index === activeIndex ? 'bg-white' : 'bg-gray-400'}`}
                        aria-current={index === activeIndex ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => setActiveIndex(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
}
