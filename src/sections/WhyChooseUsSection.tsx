/* eslint-disable react/no-unescaped-entities */

"use client";
import Image from 'next/image';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    number: "01",
    title: "20+ Years Experience",
    description: "Two decades of expertise in tech repair with thousands of satisfied customers and devices restored to perfect condition."
  },
  {
    number: "02",
    title: "Fast Turnaround",
    description: "Most repairs completed within 24-48 hours. We understand your devices are essential to your daily life and work."
  },
  {
    number: "03",
    title: "Certified Technicians",
    description: "Our team consists of certified professionals who stay updated with the latest technology and repair techniques."
  },
  {
    number: "04",
    title: "Quality Guarantee",
    description: "All repairs come with a comprehensive warranty. We stand behind our work with confidence and commitment."
  },
  {
    number: "05",
    title: "Affordable Pricing",
    description: "Competitive rates with transparent pricing. No hidden fees, just honest repair services at fair prices."
  }
];

const stats = [
  {
    number: "5000+",
    label: "Devices Repaired",
    description: "Successfully fixed"
  },
  {
    number: "98%",
    label: "Success Rate",
    description: "Customer satisfaction"
  },
  {
    number: "24hrs",
    label: "Average Repair",
    description: "Quick turnaround"
  },
  {
    number: "20+",
    label: "Years Experience",
    description: "In the industry"
  }
];

export default function WhyChooseUsSection() {
  useGSAP(() => {
    // Header animations
    gsap.set("#header-badge", { y: 30, opacity: 0, scale: 0.9 });
    gsap.set("#header-title", { y: 50, opacity: 0 });
    gsap.set("#header-description", { y: 30, opacity: 0 });

    gsap.to("#header-badge", {
      scrollTrigger: { trigger: "#why-choose-section", start: "top 80%" },
      y: 0, opacity: 1, scale: 1,
      duration: 1, ease: "back.out(1.7)"
    });

    gsap.to("#header-title", {
      scrollTrigger: { trigger: "#why-choose-section", start: "top 75%" },
      y: 0, opacity: 1,
      duration: 1.2, ease: "power4.out", delay: 0.2
    });

    gsap.to("#header-description", {
      scrollTrigger: { trigger: "#why-choose-section", start: "top 70%" },
      y: 0, opacity: 1,
      duration: 1, ease: "power4.out", delay: 0.4
    });

    // Image container animation
    gsap.set("#image-container", { x: -60, opacity: 0, scale: 0.95 });
    gsap.to("#image-container", {
      scrollTrigger: { trigger: "#main-content", start: "top 75%" },
      x: 0, opacity: 1, scale: 1,
      duration: 1.3, ease: "power4.out"
    });

    // Reasons staggered animation
    gsap.set(".reason-item", { x: 60, opacity: 0, scale: 0.95 });
    gsap.to(".reason-item", {
      scrollTrigger: { trigger: "#main-content", start: "top 70%" },
      x: 0, opacity: 1, scale: 1,
      duration: 1.1, ease: "power4.out",
      stagger: 0.15, delay: 0.3
    });

    // Stats section
    gsap.set("#stats-section", { y: 80, opacity: 0, scale: 0.96 });
    gsap.to("#stats-section", {
      scrollTrigger: { trigger: "#stats-section", start: "top 80%" },
      y: 0, opacity: 1, scale: 1,
      duration: 1.2, ease: "power4.out"
    });

    gsap.set(".stat-item", { y: 40, opacity: 0 });
    gsap.to(".stat-item", {
      scrollTrigger: { trigger: "#stats-section", start: "top 75%" },
      y: 0, opacity: 1,
      duration: 1, ease: "back.out(1.7)",
      stagger: 0.1, delay: 0.4
    });

    // CTA section
    gsap.set("#cta-section", { y: 60, opacity: 0, scale: 0.97 });
    gsap.to("#cta-section", {
      scrollTrigger: { trigger: "#cta-section", start: "top 85%" },
      y: 0, opacity: 1, scale: 1,
      duration: 1.2, ease: "power4.out"
    });

  }, []);

  return (
    <section id="why-choose-section" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div id="header-badge" className="inline-block mb-6">
            <span className="text-orange-600 font-semibold text-lg uppercase tracking-wide bg-orange-50 px-3 py-1 rounded-full">
              Why Choose Us
            </span>
          </div>
          
          <h2 id="header-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            The Trusted Choice for{' '}
            <span className="text-orange-600">Tech Repair</span>
          </h2>
          
          <p id="header-description" className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            With decades of experience and thousands of successful repairs, we're the go-to 
            experts for all your electronic device needs.
          </p>
        </div>

        {/* Main Content Grid */}
        <div id="main-content" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left Image */}
          <div id="image-container" className="relative">
            <div className="relative h-96 lg:h-[500px] w-full group">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              
              {/* Main image */}
              <div className="relative h-full w-full transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/technician-working.jpg"
                  alt="Expert technician repairing electronic device"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-2xl shadow-2xl"
                  priority
                />
                {/* Image overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 transform group-hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">20+</div>
                  <div className="text-sm font-semibold text-gray-700">Years</div>
                  <div className="text-xs text-gray-500">Experience</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Reasons */}
          <div className="space-y-8">
            {reasons.map((reason, index) => (
              <div 
                key={index}
                className="reason-item flex gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
              >
                {/* Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                    {reason.number}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Stats Section */}
        <div id="stats-section" className="bg-blue-950 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Our Track Record Speaks for Itself
            </h3>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto">
              Numbers that showcase our commitment to excellence and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-orange-100 font-semibold text-lg mb-1">
                  {stat.label}
                </div>
                <div className="text-orange-200 text-sm">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div id="cta-section" className="text-center mt-16">
          <div className="bg-gray-50 p-8 lg:p-12 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us with their valuable devices. 
              Get your free quote today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
              
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-gray-50"
              >
                Get Free Quote
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}