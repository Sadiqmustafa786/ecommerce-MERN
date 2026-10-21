import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import ProductCard from "./ProductCard";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, getWishlist, loading } = useUserStore();

  useEffect(() => {
    getWishlist();
  }, [getWishlist]);

  if (loading && wishlist.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-slate-500">Loading wishlist...</div>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:p-10">
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-slate-500">
            Save products you love and come back anytime.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Saved Items
          </p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Wishlist</h1>
        </div>

        <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-primary">
          {wishlist.length} item{wishlist.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((product) => (
          <ProductCard key={product?._id || product?.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
