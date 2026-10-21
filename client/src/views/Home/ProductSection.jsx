import { useEffect, useMemo, useState } from "react";
import useProductStore from "../../store/productStore";
import useCategoryStore from "../../store/categoryStore";
import ProductCard from "../Products/ProductCard";

const PAGE_SIZE = 8;

const sortOptions = [
  { value: "default", label: "Latest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const productStyles = `
@keyframes productIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
.product-in { animation: productIn 520ms cubic-bezier(.22, 1, .36, 1) both; animation-delay: var(--card-delay, 0ms); }
`;

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/30";

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const ProductSection = () => {
  const { products, getProducts } = useProductStore();
  const { categories, getCategories } = useCategoryStore();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getProducts(), getCategories()]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [getCategories, getProducts]);

  // Go back to the first page whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, category, maxPrice, sort]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(term);
      const matchesCategory =
        category === "all" || product.category?._id === category || product.category === category;
      const matchesPrice = maxPrice === "" || Number(product.price) <= Number(maxPrice);
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sort === "price-asc") return [...result].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") return [...result].sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "name-asc") return [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, search, category, maxPrice, sort]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasActiveFilters = search !== "" || category !== "all" || maxPrice !== "" || sort !== "default";
  const total = filteredProducts.length;

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setMaxPrice("");
    setSort("default");
  };

  const chipClass = (isActive) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
      isActive
        ? "border-transparent bg-gradient-to-r from-[#007979] to-[#0a9a9a] text-white shadow-md shadow-secondary/25"
        : "border-slate-200 bg-white text-slate-600 hover:border-secondary hover:text-[#007979]"
    }`;

  return (
    <section id="products" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
      <style>{productStyles}</style>

      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-bold text-[#007979] dark:border-secondary/30 dark:text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              New Arrivals
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Latest Products</h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Explore our latest collection, curated just for you.
            </p>
            <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-gradient-to-r from-[#007979] to-secondary sm:mx-0" />
          </div>

          {!loading && (
            <p className="text-center text-sm font-semibold text-slate-500 sm:text-right" aria-live="polite">
              <span className="text-lg font-extrabold text-[#007979] dark:text-secondary">{total}</span>{" "}
              product{total !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-10 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="relative">
              <label htmlFor="product-search" className="sr-only">
                Search products
              </label>
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </span>
              <input
                id="product-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className={`${fieldClass} pl-10 pr-4`}
              />
            </div>

            <div>
              <label htmlFor="product-max-price" className="sr-only">
                Maximum price
              </label>
              <input
                id="product-max-price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price, e.g. 1000"
                min="0"
                className={`${fieldClass} px-4`}
              />
            </div>

            <div>
              <label htmlFor="product-sort" className="sr-only">
                Sort products
              </label>
              <select id="product-sort" value={sort} onChange={(e) => setSort(e.target.value)} className={`${fieldClass} px-4`}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort: {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
            <div
              role="group"
              aria-label="Filter by category"
              className="-mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <button type="button" onClick={() => setCategory("all")} aria-pressed={category === "all"} className={chipClass(category === "all")}>
                All
              </button>
              {categories.map((item) => (
                <button
                  type="button"
                  key={item._id}
                  onClick={() => setCategory(item._id)}
                  aria-pressed={category === item._id}
                  className={chipClass(category === item._id)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 rounded-full px-3 py-2 text-sm font-bold text-[#007979] transition hover:bg-secondary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:text-secondary"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4" aria-hidden="true">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 rounded-full bg-slate-200" />
                  <div className="h-4 w-4/5 rounded-full bg-slate-200" />
                  <div className="h-4 w-1/4 rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <div className="rounded-2xl border border-dashed border-secondary/40 bg-white px-4 py-14 text-center sm:py-20">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary/10 text-[#007979] dark:text-secondary">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5M8.5 11h5" />
              </svg>
            </span>
            <h3 className="mt-5 text-xl font-bold text-slate-800">No Products Found</h3>
            <p className="mt-2 text-sm text-slate-500">Try a different search, category or price range.</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#007979] to-[#0a9a9a] px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="product-in"
                  style={{ "--card-delay": `${(index % PAGE_SIZE) * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Load more */}
            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-xs font-medium text-slate-500">
                Showing {visibleProducts.length} of {total}
              </p>
              <span className="h-1 w-40 overflow-hidden rounded-full bg-slate-200">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-[#007979] to-secondary transition-all duration-500"
                  style={{ width: `${(visibleProducts.length / total) * 100}%` }}
                />
              </span>
              {visibleCount < total && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="mt-1 inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#007979] px-8 text-sm font-bold text-[#007979] transition hover:-translate-y-0.5 hover:bg-[#007979] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-slate-900"
                >
                  Load More Products
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductSection;