/* eslint-disable react/no-unescaped-entities */

import Image from 'next/image';
import Link from 'next/link';

const milestones = [
  {
    year: "2004",
    title: "Company Founded",
    description: "Started as a small repair shop with a passion for fixing electronics and helping customers."
  },
  {
    year: "2008",
    title: "First Expansion",
    description: "Opened our second location and expanded services to include data recovery and business repairs."
  },
  {
    year: "2012",
    title: "Mobile Service Launch",
    description: "Introduced on-site repair services, bringing our expertise directly to customers' homes and offices."
  },
  {
    year: "2016",
    title: "Certification Achievement",
    description: "Achieved industry certifications and partnerships with major technology manufacturers."
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description: "Launched online booking system and contactless repair services during the pandemic."
  },
  {
    year: "2024",
    title: "20 Years Strong",
    description: "Celebrating two decades of excellence with over 5000+ devices repaired and counting."
  }
];

const team = [
  {
    name: "John Mitchell",
    role: "Founder & CEO",
    bio: "20+ years in electronics repair with expertise in mobile devices and laptops. Started the company with a vision to provide honest, reliable repair services.",
    image: "/john.jpg",
    specialties: ["Business Leadership", "Mobile Devices", "Customer Relations"]
  },
  {
    name: "Sarah Chen",
    role: "Head Technician",
    bio: "Electronics engineering background with 15 years of hands-on repair experience. Specializes in complex motherboard and component-level repairs.",
    image: "/sarah.jpg",
    specialties: ["Motherboard Repair", "Component Level", "Quality Control"]
  },
  {
    name: "Marcus Rodriguez",
    role: "Senior Repair Specialist",
    bio: "Former Apple Store technician with deep knowledge of iOS devices and Mac systems. Handles our most challenging repair cases.",
    image: "/marcus.jpg",
    specialties: ["Apple Devices", "Mac Systems", "Advanced Diagnostics"]
  },
  {
    name: "Emily Johnson",
    role: "Customer Success Manager",
    bio: "Ensures every customer has an exceptional experience from drop-off to pickup. Manages our warranty program and customer communications.",
    image: "/emily.jpg",
    specialties: ["Customer Experience", "Warranty Management", "Communication"]
  }
];

const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Quality First",
    description: "We never compromise on the quality of our repairs. Every device is thoroughly tested before return."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Fast & Reliable",
    description: "Quick turnaround times without sacrificing quality. Most repairs completed within 24-48 hours."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Customer Focused",
    description: "Your satisfaction is our priority. We build lasting relationships through exceptional service."
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    title: "Fair Pricing",
    description: "Transparent, competitive pricing with no hidden fees. You'll know the cost upfront."
  }
];

const stats = [
  { number: "5000+", label: "Devices Repaired", description: "Successfully restored to perfect condition" },
  { number: "98%", label: "Success Rate", description: "First-time repair success rate" },
  { number: "4.9/5", label: "Customer Rating", description: "Average customer satisfaction score" },
  { number: "24hrs", label: "Average Turnaround", description: "Most repairs completed quickly" }
];

export default function AboutUsPage() {
  return (
    <div className="bg-white">
      
      {/* Hero Section */}
      <section className="py-26 lg:py-34 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide bg-orange-50 px-3 py-1 rounded-full">
                Our Story
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="text-orange-600">20 Years</span> of Trusted{' '}
              <span className="block">Tech Repair Excellence</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From a small local repair shop to the region's most trusted electronics repair service, 
              we've been fixing devices and building relationships since 2004.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                How It All Started
              </h2>
              
              <div className="space-y-6 text-gray-600">
                <p className="text-lg leading-relaxed">
                  TechRepair Pro was born out of frustration with poor customer service and overpriced repairs 
                  at big box stores. Our founder, John Mitchell, started fixing electronics as a hobby in college 
                  and quickly realized there was a better way to serve customers.
                </p>
                
                <p className="text-lg leading-relaxed">
                  What started as weekend repairs for friends and family grew into a small shop, then a trusted 
                  business serving thousands of customers. Today, we&apos;re proud to be the go-to repair experts 
                  for individuals, small businesses, and even other repair shops who trust us with their most 
                  challenging cases.
                </p>

                <p className="text-lg leading-relaxed">
                  Our commitment remains the same as day one: provide honest, high-quality repairs at fair prices, 
                  treat every device like it belongs to a family member, and never stop learning about new 
                  technologies and repair techniques.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 lg:h-[500px] w-full">
                <Image
                  src="/about-story.jpg"
                  alt="Our repair shop through the years"
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>
              
              {/* Experience Badge */}
              <div className="absolute -bottom-6 -left-6 bg-orange-600 text-white p-6 rounded-2xl shadow-2xl">
                <div className="text-center">
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-sm font-semibold">Years Experience</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Journey Through the Years
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that shaped us into the trusted repair experts we are today.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-orange-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-orange-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* Empty Space */}
                  <div className="w-5/12"></div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every repair we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The skilled professionals behind every successful repair, dedicated to getting your devices back to perfect condition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <div className="text-orange-600 font-medium mb-4">
                  {member.role}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                
                <div className="space-y-1">
                  {member.specialties.map((specialty, idx) => (
                    <span key={idx} className="inline-block bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs font-medium mr-1">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their valuable devices. 
            Get your free diagnosis and quote today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
              Get Free Quote
            </Link>
            
            <Link
              href="tel:+1234567890"
              className="inline-flex items-center justify-center gap-2 border-2 border-white hover:border-orange-200 text-white hover:text-orange-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-white hover:bg-opacity-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}