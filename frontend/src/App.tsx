import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import School from "./pages/School";
import Services from "./pages/Services";
import Magazine from "./pages/Magazine";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EventForm from "./pages/admin/EventForm";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="min-h-screen bg-gray-900 text-white">
					<Routes>
						{/* Public Routes */}
						<Route
							path="/"
							element={
								<>
									<Navigation />
									<main>
										<Home />
									</main>
								</>
							}
						/>
						<Route
							path="/about"
							element={
								<>
									<Navigation />
									<main>
										<About />
									</main>
								</>
							}
						/>
						<Route
							path="/events"
							element={
								<>
									<Navigation />
									<main>
										<Events />
									</main>
								</>
							}
						/>
						<Route
							path="/school"
							element={
								<>
									<Navigation />
									<main>
										<School />
									</main>
								</>
							}
						/>
						<Route
							path="/services"
							element={
								<>
									<Navigation />
									<main>
										<Services />
									</main>
								</>
							}
						/>
						<Route
							path="/magazine"
							element={
								<>
									<Navigation />
									<main>
										<Magazine />
									</main>
								</>
							}
						/>
						<Route
							path="/contact"
							element={
								<>
									<Navigation />
									<main>
										<Contact />
									</main>
								</>
							}
						/>

						{/* Admin Routes */}
						<Route path="/admin/login" element={<AdminLogin />} />
						<Route
							path="/admin/dashboard"
							element={
								<ProtectedRoute>
									<AdminDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/events/new"
							element={
								<ProtectedRoute>
									<EventForm />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/events/:id/edit"
							element={
								<ProtectedRoute>
									<EventForm />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
