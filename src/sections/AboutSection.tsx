/* eslint-disable react/no-unescaped-entities */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  useGSAP(() => {
    // Timeline for coordinated animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about-section",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Image slides in from left
    tl.from("#about-image", {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    })
    
    // Content elements stagger in from right
    .from("#about-badge", {
      x: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.8")
    
    .from("#about-heading", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.6")
    
    .from("#about-paragraphs p", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: "power2.out"
    }, "-=0.4")
    
    .from("#about-button", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.3");
  }, []);

  return (
    <section id="about-section" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Image */}
          <div className="relative">
            <div id="about-image" className="relative h-96 lg:h-[500px] w-full">
              <Image
                src="/boss.jpg"
                alt="Professional technician working on AC unit"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-2xl"
                priority
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span id="about-badge" className="text-orange-600 font-semibold text-lg uppercase tracking-wide bg-orange-50 px-3 py-1 rounded-full">
                  About
                </span>
              </div>

              <h2 id="about-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                We've been working in the industry for{' '}
                <span className="text-orange-600">20 years</span>
              </h2>

              <div id="about-paragraphs" className="space-y-4 text-gray-600">
                <p className="text-lg leading-relaxed">
                  Tempor tristique diam id semper tellus. Est aliquam sit est ac. 
                  Felis diam nunc nibh blandit risus. Hendrerit sed consectetur quis 
                  leo praesent scelerisque integer amet. Sit fermentum.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Placerat non id nullam arcu nulla. Gravida sed neque ut in aliquam 
                  iaculis. Tellus id sollicitudin sit eget. Consequat neque felis nisl 
                  tempus eu tincidunt tortor cras. Sapien ut morbi.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                id="about-button"
                href="/about-us"
                className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-gray-50 group"
              >
                About us
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}