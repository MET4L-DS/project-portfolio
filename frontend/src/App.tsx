import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import School from "./pages/School";
import Magazine from "./pages/Magazine";
import Contact from "./pages/Contact";

function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-900 text-white">
				<Navigation />
				<main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/events" element={<Events />} />
						<Route path="/school" element={<School />} />
						<Route path="/magazine" element={<Magazine />} />
						<Route path="/contact" element={<Contact />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
