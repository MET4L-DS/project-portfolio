import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

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

	// Close mobile menu on Escape key press
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isMobileMenuOpen) {
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isMobileMenuOpen]);

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
							<span className="text-yellow-400">Sankalp</span>
							<span className="text-white"> | Saurav Shil</span>
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

					<div className="lg:hidden">
						<button
							onClick={toggleMobileMenu}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
							aria-expanded={isMobileMenuOpen}
						>
							<span className="sr-only">Open main menu</span>
							<div className="relative w-6 h-6">
								<span
									className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
										isMobileMenuOpen
											? "rotate-45 translate-y-2"
											: "translate-y-0"
									}`}
								/>
								<span
									className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out translate-y-2 ${
										isMobileMenuOpen
											? "opacity-0"
											: "opacity-100"
									}`}
								/>
								<span
									className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
										isMobileMenuOpen
											? "-rotate-45 translate-y-2"
											: "translate-y-4"
									}`}
								/>
							</div>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<div className="lg:hidden">
				{/* Overlay */}
				<div
					className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${
						isMobileMenuOpen
							? "opacity-100 visible"
							: "opacity-0 invisible"
					}`}
					onClick={closeMobileMenu}
				/>

				{/* Menu */}
				<div
					className={`absolute left-0 right-0 top-full bg-gray-800/95 backdrop-blur-lg border-b border-gray-700 shadow-lg transition-all duration-300 ease-in-out transform z-50 ${
						isMobileMenuOpen
							? "opacity-100 translate-y-0 visible"
							: "opacity-0 -translate-y-4 invisible"
					}`}
				>
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{navItems.map((item, index) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={closeMobileMenu}
								className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 transform ${
									location.pathname === item.path
										? "bg-yellow-400 text-black"
										: "text-gray-300 hover:bg-gray-700 hover:text-white"
								} ${
									isMobileMenuOpen
										? "translate-x-0 opacity-100"
										: "translate-x-4 opacity-0"
								}`}
								style={{
									transitionDelay: isMobileMenuOpen
										? `${index * 50}ms`
										: "0ms",
								}}
							>
								{item.label}
							</Link>
						))}
						<Link
							to="/admin/login"
							onClick={closeMobileMenu}
							className={`block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-base font-medium transition-all duration-200 transform mt-3 ${
								isMobileMenuOpen
									? "translate-x-0 opacity-100"
									: "translate-x-4 opacity-0"
							}`}
							style={{
								transitionDelay: isMobileMenuOpen
									? `${navItems.length * 50}ms`
									: "0ms",
							}}
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
			</div>
		</nav>
	);
}

export default Navigation;
