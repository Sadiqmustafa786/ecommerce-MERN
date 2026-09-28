import useProductStore from "../../store/productStore";
import useCategoryStore from "../../store/categoryStore";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "../Products/ProductCard";

const ProductSection = () => {
  const { products, getProducts } = useProductStore();
  const { categories, getCategories } = useCategoryStore();

  // Search and filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    void Promise.allSettled([getProducts(), getCategories()]);
  }, [getCategories, getProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search by product name
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      // Category filter
      const matchesCategory =
        category === "all" ||
        product.category?._id === category ||
        product.category === category;

      // Price filter
      const matchesPrice =
        maxPrice === "" || Number(product.price) <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, category, maxPrice]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setMaxPrice("");
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}

        <div className="mb-8 text-center">
          <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
            New Arrivals
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Latest Products
          </h2>

          <p className="mt-3 text-gray-500">
            Explore our latest collection curated just for you
          </p>
        </div>

        {/* Filters */}

        <div className="mb-8 rounded-xl border bg-white p-4 shadow-sm sm:mb-10 sm:p-5">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Search Product
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product..."
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>

                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Maximum Price
              </label>

              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 1000"
                min="0"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clear */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Result Count */}

        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h3 className="text-lg font-bold text-gray-800 sm:text-xl">Products</h3>

          <p className="text-sm text-gray-500">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Products */}

        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border bg-white px-4 py-12 text-center sm:py-16">
            <div className="mb-4 text-5xl">🔍</div>

            <h3 className="text-xl font-bold text-gray-800">
              No Products Found
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2 mt-5 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
