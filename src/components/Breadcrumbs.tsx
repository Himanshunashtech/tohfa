import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="container mx-auto max-w-6xl px-6 mb-8 mt-4">
      <motion.ol 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-2 text-xs font-medium"
      >
        <li>
          <Link
            to="/"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors gap-1.5"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const label = value
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <li key={to} className="flex items-center space-x-2">
              <ChevronRight size={12} className="text-muted-foreground/50" />
              {last ? (
                <span className="text-foreground font-semibold" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </motion.ol>
    </nav>
  );
};

export default Breadcrumbs;
