import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Events' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <span className="text-white">Saurav Shil</span>
          <span className="text-yellow-400"> | Sankalp</span>
        </div>
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-yellow-400 text-black'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="https://aamarxopun.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-all"
          >
            AAMAR XOPUN
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;