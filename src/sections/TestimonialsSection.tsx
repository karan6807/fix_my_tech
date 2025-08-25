'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    quote: "Absolutely fantastic service! My laptop was completely dead and they brought it back to life in just 2 days. Professional, fast, and affordable. Highly recommended!",
    name: "Sarah Johnson",
    position: "Business Owner",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 2,
    quote: "My phone screen was completely shattered and I thought it was hopeless. They fixed it perfectly and now it looks brand new. Great customer service too!",
    name: "Michael Chen", 
    position: "Software Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 3,
    quote: "Quick turnaround time and excellent quality repair work. They diagnosed the issue immediately and had my tablet working like new. Will definitely use again!",
    name: "Emily Rodriguez",
    position: "Graphic Designer", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 4,
    quote: "Outstanding repair service! They were transparent about costs, completed the work ahead of schedule, and my device works better than before. Five stars!",
    name: "David Thompson",
    position: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 5,
    quote: "Professional, reliable, and honest service. They explained everything clearly and the repair was done perfectly. I trust them completely with my devices.",
    name: "Lisa Wang",
    position: "Teacher",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useGSAP(() => {
    // Header animations - simple and clean
    gsap.set("#testimonials-badge", { y: 30, opacity: 0 });
    gsap.set("#testimonials-title", { y: 40, opacity: 0 });

    gsap.to("#testimonials-badge", {
      scrollTrigger: { trigger: "#testimonials-section", start: "top 85%" },
      y: 0, opacity: 1,
      duration: 1, ease: "power4.out"
    });

    gsap.to("#testimonials-title", {
      scrollTrigger: { trigger: "#testimonials-section", start: "top 80%" },
      y: 0, opacity: 1,
      duration: 1.2, ease: "power4.out", delay: 0.2
    });

    // Testimonial cards - gentle stagger
    gsap.set(".testimonial-card", { y: 50, opacity: 0, scale: 0.95 });
    gsap.to(".testimonial-card", {
      scrollTrigger: { trigger: "#testimonials-grid", start: "top 80%" },
      y: 0, opacity: 1, scale: 1,
      duration: 1, ease: "power4.out",
      stagger: 0.1
    });

    // Navigation dots - subtle entrance
    gsap.set("#navigation-dots", { y: 20, opacity: 0 });
    gsap.to("#navigation-dots", {
      scrollTrigger: { trigger: "#testimonials-grid", start: "top 70%" },
      y: 0, opacity: 1,
      duration: 0.8, ease: "power4.out", delay: 0.6
    });

  }, []);

  // Re-animate cards when currentIndex changes
  useGSAP(() => {
    gsap.fromTo(".testimonial-card", 
      { y: 20, opacity: 0.8 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08 }
    );
  }, [currentIndex]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section id="testimonials-section" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p id="testimonials-badge" className="text-lg font-semibold text-orange-600 uppercase tracking-wide mb-2">
            TESTIMONIES
          </p>
          <h2 id="testimonials-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Happy Clients & Feedbacks
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div id="testimonials-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {getVisibleTestimonials().map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="testimonial-card bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
              </div>

              {/* Quote Text */}
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {testimonial.quote}
              </p>

              {/* Author Info */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div id="navigation-dots" className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-orange-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}