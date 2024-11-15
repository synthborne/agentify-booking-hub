import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-primary">
              RealEstate
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/auth"
              className="px-4 py-2 rounded-lg text-primary hover:bg-secondary/50 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/auth?mode=signup"
              className="px-4 py-2 rounded-lg bg-accent text-white button-hover"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;