import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            About Us
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Welcome to ShopSmart
          </p>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
            We help you discover the best prices across multiple e-commerce platforms — fast, easy, and reliable.
          </p>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To empower online shoppers with smart comparison tools that help them save money and make confident buying decisions.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">What We Do</h3>
            <p className="text-gray-600 leading-relaxed">
              We compare product prices from trusted online retailers and bring them to one place — your one-stop shop for finding the best deal.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Why Choose Us?</h3>
            <p className="text-gray-600 leading-relaxed">
              We focus on simplicity, accuracy, and transparency — helping you save time, money, and effort while shopping online.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Our Vision</h3>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            To become the most trusted price comparison platform globally, helping millions shop smarter and make informed buying decisions.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <a
            href="#contact"
            className="px-8 py-4 text-lg font-medium bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;