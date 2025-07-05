import { Link, useLocation } from "react-router-dom";

function Navigation() {
	const location = useLocation();
	const navItems = [
		{ path: "/", label: "Home" },
		{ path: "/about", label: "About" },
		{ path: "/events", label: "Events" },
		{ path: "/school", label: "School" },
		{ path: "/services", label: "Services" },
		{ path: "/magazine", label: "Aamar Xopun" },
		{ path: "/contact", label: "Contact" },
	];

	return (
		<nav className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 p-4 sticky top-0 z-50">
			<div className="pl-20 mx-auto flex justify-between items-center">
				{" "}
				<div className="flex items-center gap-3">
					<img
						src="./logo/sankalp_logo.jpg"
						alt="Sankalp Logo"
						className="h-8 w-auto rounded"
					/>
					<div className="text-xl font-bold">
						<span className="text-white">Saurav Shil</span>
						<span className="text-yellow-400"> | Sankalp</span>
					</div>
				</div>
				<div className="flex items-center space-x-6">
					<ul className="flex space-x-6">
						{navItems.map((item) => (
							<li key={item.path}>
								<Link
									to={item.path}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
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
			</div>
		</nav>
	);
}

export default Navigation;
