import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCategoryStore from "../../store/categoryStore";

const categoryStyles = `
@keyframes categoryIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.category-card-in { animation: categoryIn 520ms cubic-bezier(.22, 1, .36, 1) both; animation-delay: var(--card-delay, 0ms); }
`;

const SKELETON_COUNT = 7;

const ArrowIcon = ({ direction = "right", className = "h-5 w-5" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={direction === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
  </svg>
);

const CategorySection = () => {
  const { categories, getCategories } = useCategoryStore();
  const navigate = useNavigate();
  const scrollerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(getCategories()).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [getCategories]);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setCanPrev(scroller.scrollLeft > 4);
    setCanNext(scroller.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [categories, loading, updateScrollState]);

  const scrollCategories = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: "smooth" });
  };

  const controlClass =
    "grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-secondary hover:text-[#007979] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:pointer-events-none disabled:opacity-40";

  return (
    <section
      id="categories"
      className="category-section relative overflow-hidden bg-gradient-to-b from-white to-secondary/5 py-12 sm:py-16"
    >
      <style>{categoryStyles}</style>

      {/* Soft decorative glow */}
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#007979]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-bold text-[#007979] dark:border-secondary/30 dark:text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Browse Collections
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Shop By Category
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Explore our popular categories and find exactly what you need.
            </p>
            <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-gradient-to-r from-[#007979] to-secondary sm:mx-0" />
          </div>

          <div className="flex items-center justify-center gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-[#007979] transition hover:bg-secondary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:text-secondary"
            >
              View all products
              <ArrowIcon className="h-4 w-4" />
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollCategories(-1)}
                disabled={!canPrev}
                className={controlClass}
                aria-label="Show previous categories"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={() => scrollCategories(1)}
                disabled={!canNext}
                className={controlClass}
                aria-label="Show next categories"
              >
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          role="region"
          aria-label="Product categories"
          className="-mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth px-4 pb-6 pt-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-3 sm:gap-5">
            {loading &&
              Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="flex min-h-[11rem] basis-[42%] shrink-0 animate-pulse flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-5 sm:basis-[10.5rem] lg:basis-[11.5rem]"
                >
                  <div className="h-20 w-20 rounded-full bg-slate-200 sm:h-24 sm:w-24" />
                  <div className="mt-4 h-3 w-20 rounded-full bg-slate-200" />
                </div>
              ))}

            {!loading &&
              categories.map((category, index) => (
                <button
                  type="button"
                  key={category._id}
                  onClick={() => navigate(`/products?category=${category._id}`)}
                  style={{ "--card-delay": `${Math.min(index, 8) * 60}ms` }}
                  className="category-card-in group relative flex min-h-[11rem] basis-[42%] shrink-0 snap-start flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white px-3 py-5 text-center shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-secondary/60 hover:shadow-xl hover:shadow-secondary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:basis-[10.5rem] sm:px-4 lg:basis-[11.5rem]"
                >
                  {/* Top accent line */}
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#007979] to-secondary transition-transform duration-300 group-hover:scale-x-100" />

                  {/* Image with gradient ring */}
                  <span className="rounded-full bg-gradient-to-br from-secondary to-[#007979] p-[3px] shadow-md shadow-secondary/20 transition duration-300 group-hover:scale-105">
                    <span className="flex h-[4.75rem] w-[4.75rem] items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 sm:h-[5.5rem] sm:w-[5.5rem]">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-2xl font-extrabold text-[#007979]">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </span>
                  </span>

                  <h3 className="mt-4 w-full truncate text-sm font-bold text-slate-800 sm:text-[0.95rem]">
                    {category.name}
                  </h3>

                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#007979] transition duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 dark:text-secondary">
                    Shop now
                    <ArrowIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </button>
              ))}
          </div>

          {!loading && categories.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-500">
              No categories available right now. Please check back soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;