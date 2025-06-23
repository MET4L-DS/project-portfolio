import { Link, useLocation } from "react-router-dom";

function Navigation() {
	const location = useLocation();
	const navItems = [
		{ path: "/", label: "Home" },
		{ path: "/about", label: "About" },
		{ path: "/events", label: "Events" },
		{ path: "/school", label: "School" },
		{ path: "/magazine", label: "Aamar Xopun" },
		{ path: "/contact", label: "Contact" },
	];

	return (
		<nav className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 p-4 sticky top-0 z-50">
			<div className="max-w-6xl mx-auto flex justify-between items-center">
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
				</div>
			</div>
		</nav>
	);
}

export default Navigation;
