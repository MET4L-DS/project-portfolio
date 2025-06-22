import { useState } from 'react';

function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const projects = [
    {
      id: 1,
      title: "Northeast Talent Hunt",
      category: "Talent Hunt",
      image: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Northeast+Talent+Hunt",
      description: "Premier talent competition showcasing the best of Northeast India's emerging artists"
    },
    {
      id: 2,
      title: "Northeast Shining Star",
      category: "Beauty Pageant",
      image: "https://via.placeholder.com/400x300/ec4899/ffffff?text=Shining+Star",
      description: "Prestigious beauty pageant celebrating the grace and talent of Northeast beauties"
    },
    {
      id: 3,
      title: "Perfect Glam Beauty Pageant Season 2",
      category: "Beauty Pageant",
      image: "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Perfect+Glam",
      description: "Second season of the glamorous beauty pageant with enhanced production value"
    },
    {
      id: 4,
      title: "Guwahati City Fest",
      category: "City Festival",
      image: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=City+Fest",
      description: "Production Head of this major city-wide celebration of culture and entertainment"
    },
    {
      id: 5,
      title: "Fashion Carnival",
      category: "Fashion Show",
      image: "https://via.placeholder.com/400x300/10b981/ffffff?text=Fashion+Carnival",
      description: "Main event manager for this spectacular fashion extravaganza"
    },
    {
      id: 6,
      title: "Fashion Frolic",
      category: "Fashion Show",
      image: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Fashion+Frolic",
      description: "Innovative fashion show combining traditional and contemporary styles"
    },
    {
      id: 7,
      title: "Sustainable Runway - Kite Festival",
      category: "Special Event",
      image: "https://via.placeholder.com/400x300/06b6d4/ffffff?text=Sustainable+Runway",
      description: "Eco-friendly fashion showcase during the famous Kite Festival"
    },
    {
      id: 8,
      title: "Alcheringa Event",
      category: "Cultural Festival",
      image: "https://via.placeholder.com/400x300/f97316/ffffff?text=Alcheringa",
      description: "Cultural extravaganza celebrating Northeast India's rich heritage"
    },
    {
      id: 9,
      title: "Shrimoyee",
      category: "Cultural Event",
      image: "https://via.placeholder.com/400x300/dc2626/ffffff?text=Shrimoyee",
      description: "Elegant cultural event honoring traditional values and modern aspirations"
    },
    {
      id: 10,
      title: "Goalpara Shining Star",
      category: "Beauty Pageant",
      image: "https://via.placeholder.com/400x300/7c3aed/ffffff?text=Goalpara+Star",
      description: "Show Director for this regional beauty pageant in Goalpara"
    }
  ];

  const categories = ["All", "Beauty Pageant", "Talent Hunt", "Fashion Show", "City Festival", "Cultural Festival", "Cultural Event", "Special Event"];

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            My <span className="text-yellow-400 font-bold">Event Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From beauty pageants to cultural festivals, witness the spectacular events 
            that have shaped Northeast India's entertainment landscape
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full border-2 border-yellow-400 font-semibold transition-all text-sm ${
                  activeCategory === category
                    ? 'bg-yellow-400 text-black'
                    : 'text-yellow-400 hover:bg-yellow-400 hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-2xl aspect-video transition-transform duration-300 hover:scale-105">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-300">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to create your next big event?
          </h3>
          <p className="text-gray-300 mb-8 text-lg">
            Let's collaborate to bring your vision to life with Sankalp Entertainment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
              Book Consultation
            </button>
            <a
              href="https://aamarxopun.com"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-all transform hover:scale-105"
            >
              Visit AAMAR XOPUN
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;