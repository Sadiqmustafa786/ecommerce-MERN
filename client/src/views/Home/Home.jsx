import CategorySection from "./CategorySection";
import HeroSection from "./HeroSection";
import ProductSection from "./ProductSection";
import PyroEffect from "./PyroEffect";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== "#categories") return;

    requestAnimationFrame(() => {
      document.getElementById("categories")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.hash]);

  return (
    <div className="home-page">
      <PyroEffect />

      <HeroSection />

      <CategorySection />

      <ProductSection />
    </div>
  );
};

export default Home;
