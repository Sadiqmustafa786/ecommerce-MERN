import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useProductStore from "../../store/productStore";
import Loader from "../../components/common/Loader";
import ProductCard from "./ProductCard";

const Products = () => {
  const { products, getProducts, loading } = useProductStore();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("category");

  useEffect(() => {
    getProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}

        <div className="mb-9 text-center sm:mb-12">
          <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-primary uppercase bg-secondary/10 rounded-full">
            Our Collection
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            All Products
          </h1>

          <p className="mt-3 text-gray-500">
            Explore our complete collection of products
          </p>
        </div>

        {/* Products Grid */}

        {(() => {
          const filtered = categoryId
            ? products.filter(
                (p) =>
                  p.category?._id === categoryId || p.category === categoryId,
              )
            : products;

          if (filtered.length === 0) {
            return (
              <div className="rounded-xl border bg-white px-4 py-16 text-center text-gray-500 sm:py-20">
                There are no products related to this category.
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          );
        })()}
      </div>
    </section>
  );
};

export default Products;
