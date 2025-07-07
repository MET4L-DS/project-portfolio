import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navigation() {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const navItems = [
		{ path: "/", label: "Home" },
		{ path: "/about", label: "About" },
		{ path: "/events", label: "Events" },
		{ path: "/school", label: "School" },
		{ path: "/services", label: "Services" },
		{ path: "/magazine", label: "Aamar Xopun" },
		{ path: "/contact", label: "Contact" },
	];

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center gap-2 sm:gap-3">
						<img
							src="./logo/sankalp_logo.jpg"
							alt="Sankalp Logo"
							className="h-6 w-auto sm:h-8 rounded"
						/>
						<div className="text-sm sm:text-xl font-bold">
							<span className="text-white">Saurav Shil</span>
							<span className="text-yellow-400"> | Sankalp</span>
						</div>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
						<ul className="flex space-x-4 xl:space-x-6">
							{navItems.map((item) => (
								<li key={item.path}>
									<Link
										to={item.path}
										className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
											location.pathname === item.path
												? "bg-yellow-400 text-black"
												: "text-gray-300 hover:bg-gray-700 hover:text-white"
										}`}
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
						<Link
							to="/admin/login"
							className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Admin
						</Link>
					</div>

					{/* Mobile menu button */}
					<div className="lg:hidden">
						<button
							onClick={toggleMobileMenu}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
							aria-expanded="false"
						>
							<span className="sr-only">Open main menu</span>
							{!isMobileMenuOpen ? (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							) : (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isMobileMenuOpen && (
				<div className="lg:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/95 backdrop-blur-lg border-t border-gray-700">
						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={closeMobileMenu}
								className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
									location.pathname === item.path
										? "bg-yellow-400 text-black"
										: "text-gray-300 hover:bg-gray-700 hover:text-white"
								}`}
							>
								{item.label}
							</Link>
						))}
						<Link
							to="/admin/login"
							onClick={closeMobileMenu}
							className="block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base font-medium transition-all mt-3"
						>
							<div className="flex items-center gap-2">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Admin
							</div>
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}

export default Navigation;
