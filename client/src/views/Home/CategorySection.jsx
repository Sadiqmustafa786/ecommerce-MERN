import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCategoryStore from "../../store/categoryStore";

const CategorySection = () => {
  const { categories, getCategories } = useCategoryStore();

  const navigate = useNavigate();
  const categoryScrollerRef = useRef(null);

  const scrollCategories = (direction) => {
    categoryScrollerRef.current?.scrollBy({
      left: direction * (categoryScrollerRef.current.clientWidth + 16),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <section id="categories" className="category-section bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">Shop By Category</h2>

          <p className="mt-2 text-gray-500">Explore our popular categories</p>
        </div>

        {/* Categories */}

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => scrollCategories(-1)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-xl leading-none text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-11 sm:w-11"
            aria-label="Show previous categories"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>

          <div
            ref={categoryScrollerRef}
            className="min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Product categories"
          >
            <div className="flex gap-4 pb-2 sm:gap-5">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category._id}
                  onClick={() => navigate(`/products?category=${category._id}`)}
                  className="flex min-h-[9rem] basis-full shrink-0 snap-start flex-col justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:basis-[9.5rem] sm:px-4"
                >
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {category.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <h3 className="truncate text-sm font-semibold text-gray-700">
                    {category.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollCategories(1)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-xl leading-none text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-11 sm:w-11"
            aria-label="Show next categories"
          >
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
