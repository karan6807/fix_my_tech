'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useGSAP} from "@gsap/react";
import gsap from "gsap";

const images = [
  "/repair.jpg",
  "/laptop-repair.jpg",
  "/phone-repair.jpg"
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

   useGSAP(() => {
    gsap.from('#hero-content', {
      y: 50,
      opacity: 0,
      duration: 1.5,
    })
  })

  return (
    <section className="relative w-full h-[870px] overflow-hidden">
      {/* Background Carousel */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img}
            alt={`Repair service ${index + 1}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Blue-tinted overlay for better text readability and aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-slate-900/70"></div>
      <div className="absolute inset-0 bg-black/20"></div>
 
      {/* Hero Content Overlay - Centered */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div id="hero-content" className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your <span className="text-orange-600">trusted repair experts</span> for all{' '}
                <span className="text-white">tech solutions</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Professional repair services for laptops, smartphones, tablets, and all electronic devices. 
                Fast, reliable, and affordable solutions delivered to your doorstep.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book-repair"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-center shadow-lg hover:shadow-xl"
              >
                Book Repair Service
              </Link>

              <Link
                href="/locations"
                className="border-2 border-white border-opacity-80 hover:border-opacity-100 text-white hover:bg-white hover:bg-opacity-10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 text-center backdrop-blur-sm"
              >
                View Service Areas
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}