'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    image: "/laptop-repair.jpg",
    title: "Laptop Repair",
    description: "Expert laptop repair services for all major brands including screen replacement, keyboard fixes, and hardware upgrades.",
    features: ["Screen Replacement", "Hardware Upgrades", "Data Recovery"]
  },
  {
    image: "/phone-repair.jpg",
    title: "Mobile Phone Repair",
    description: "Fast and reliable smartphone repair services including cracked screen fixes, battery replacement, and software issues.",
    features: ["Screen Repair", "Battery Replacement", "Water Damage Fix"]
  },
  {
    image: "/computer-hardware.jpg",
    title: "Computer Hardware",
    description: "Complete desktop and PC repair services including component replacement, performance optimization, and custom builds.",
    features: ["Component Upgrade", "Performance Boost", "Custom Builds"]
  },
  {
    image: "/software-repair.jpg",
    title: "Software Solutions",
    description: "Comprehensive software troubleshooting, virus removal, operating system installation, and data backup services.",
    features: ["Virus Removal", "OS Installation", "Data Backup"]
  },
  {
    image: "/network-setup.jpg",
    title: "Network Setup",
    description: "Professional network configuration, Wi-Fi setup, router installation, and connectivity troubleshooting for homes and offices.",
    features: ["Wi-Fi Setup", "Router Config", "Network Security"]
  },
  {
    image: "/tech-support.jpg",
    title: "Tech Support",
    description: "Ongoing technical support and maintenance services to keep your devices running smoothly with regular check-ups.",
    features: ["Remote Support", "Regular Maintenance", "Tech Consultation"]
  }
];

export default function ServicesSection() {
  useGSAP(() => {
    // Header animations
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#services-section",
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse"
      }
    });

    headerTl
      .from("#services-badge", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      })
      .from("#services-heading", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.4")
      .from("#services-description", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6");

    // Services cards animation
    gsap.set("#services-grid > div", { y: 80, opacity: 0, scale: 0.95 });
    
    gsap.to("#services-grid > div", {
      scrollTrigger: {
        trigger: "#services-grid",
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out"
    });

    // CTA section animation
    gsap.from("#services-cta", {
      scrollTrigger: {
        trigger: "#services-cta",
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    });
  }, []);

  return (
    <section id="services-section" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span id="services-badge" className="text-orange-600 font-semibold text-lg uppercase tracking-wide bg-orange-50 px-3 py-1 rounded-full">
              Our Services
            </span>
          </div>
          
          <h2 id="services-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Expert Tech Repair Services
          </h2>
          
          <p id="services-description" className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From laptops to smartphones, we provide comprehensive repair solutions 
            for all your electronic devices with fast turnaround times.
          </p>
        </div>

        {/* Services Grid */}
        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-100 group"
            >
              {/* Image */}
              <div className="mb-6 overflow-hidden rounded-xl">
                <div className="relative h-48 w-full">
                  <Image
                    src={service.image}
                    alt={`${service.title} service`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-orange-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div id="services-cta" className="bg-white p-8 lg:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Need Help With Your Device?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get a free diagnosis and quote for your repair. Our expert technicians 
              are ready to bring your devices back to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Free Quote
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-gray-50"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}