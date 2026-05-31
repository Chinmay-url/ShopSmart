import React from "react";

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto py-20 px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Contact Us</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            We’d love to hear from you
          </p>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Whether you have a question, feedback, or business inquiry — feel free to reach out. Our team will respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Send a Message</h3>
            <form action="#" method="POST" className="grid grid-cols-1 gap-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" autoComplete="name" className="mt-1 py-3 px-4 block w-full shadow-sm focus:ring-blue-600 focus:border-blue-600 border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" className="mt-1 py-3 px-4 block w-full shadow-sm focus:ring-blue-600 focus:border-blue-600 border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" name="message" rows={5} className="mt-1 py-3 px-4 block w-full shadow-sm focus:ring-blue-600 focus:border-blue-600 border-gray-300 rounded-md"></textarea>
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-xl shadow-md transition">
                Send Message
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center p-8 bg-blue-600 text-white rounded-2xl shadow-xl">
            <h3 className="text-3xl font-bold mb-6">Contact Information</h3>
            <p className="text-lg mb-4">
              Feel free to connect with us for support or collaboration.
            </p>
            <div className="space-y-4">
              <p className="text-lg"><strong>Email:</strong> support@shopsmart.com</p>
              <p className="text-lg"><strong>Phone:</strong> +91 98765 43210</p>
              <p className="text-lg"><strong>Location:</strong> Pune, Maharashtra, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;