function Contact() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Get In <span className="text-yellow-400 font-bold">Touch</span>
          </h1>
          <p className="text-xl text-gray-300">
            Ready to create your next spectacular event? Let's bring your vision to life with Sankalp Entertainment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Event Type</label>
                <select className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none">
                  <option value="">Select Event Type</option>
                  <option value="beauty-pageant">Beauty Pageant</option>
                  <option value="talent-hunt">Talent Hunt</option>
                  <option value="fashion-show">Fashion Show</option>
                  <option value="cultural-event">Cultural Event</option>
                  <option value="corporate-event">Corporate Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  placeholder="Tell us about your event vision..."
                />
              </div>
              <button className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">📧 Business Email</h3>
              <p className="text-gray-300">
                <a href="mailto:sankalpentertainment360@gmail.com" className="hover:text-yellow-400 transition-colors">
                  sankalpentertainment360@gmail.com
                </a>
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">🏢 Company</h3>
              <p className="text-gray-300">
                Sankalp Entertainment<br />
                Leading Event Management Company<br />
                Assam, Northeast India
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">📱 Digital Magazine</h3>
              <p className="text-gray-300 mb-3">AAMAR XOPUN E-Magazine</p>
              <a
                href="https://aamarxopun.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Visit Magazine
              </a>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">🌐 Follow Us</h3>
              <div className="space-y-2">
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Facebook</a>
                  <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Instagram</a>
                  <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">LinkedIn</a>
                </div>
                <div className="text-sm text-gray-400">
                  Follow for latest events and updates
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">💼 Services</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Event Planning & Management</li>
                <li>• Beauty Pageant Organization</li>
                <li>• Fashion Show Production</li>
                <li>• Cultural Festival Management</li>
                <li>• Talent Hunt Competitions</li>
                <li>• Media & Publishing Services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;