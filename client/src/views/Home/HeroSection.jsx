import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-section overflow-hidden bg-gradient-to-r from-secondary-50 to-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2">
        {/* Left Content */}

        <div>
          <span className="inline-block px-4 py-2 text-sm font-medium text-primary bg-secondary-100 rounded-full">
            New Collection Available
          </span>

          <h1 className="hero-title mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
            <span className="hero-typing-line">Find Everything You Need</span>
            <span className="hero-typing-line text-primary">In One Place</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Discover premium quality products with the best prices. Enjoy secure
            shopping, fast delivery and a smooth experience.
          </p>

          {/* Buttons */}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              to="/products"
              className="w-full rounded-lg bg-primary px-7 py-3 text-center text-white transition hover:bg-primary-700 sm:w-auto"
            >
              Shop Now
            </Link>

            <Link
              to="/categories"
              className="w-full rounded-lg border border-gray-300 px-7 py-3 text-center transition hover:bg-gray-100 sm:w-auto"
            >
              Browse Categories
            </Link>
          </div>

          {/* Features */}

          <div className="mt-8 grid grid-cols-3 gap-3 sm:flex sm:gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">100+</h3>

              <p className="text-sm text-gray-500 sm:text-base">Products</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">24/7</h3>

              <p className="text-sm text-gray-500 sm:text-base">Support</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">Fast</h3>

              <p className="text-sm text-gray-500 sm:text-base">Delivery</p>
            </div>
          </div>
        </div>

        {/* Right Image */}

        <div className="hero-visual relative flex justify-center">
          <div className="absolute h-56 w-56 rounded-full bg-secondary-200 opacity-40 blur-3xl sm:h-72 sm:w-72"></div>

          <div className="hero-image-rotator relative z-10">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
              alt="shopping"
              className="hero-image w-full max-w-md rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
