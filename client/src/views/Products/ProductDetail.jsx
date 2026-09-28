import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import useProductStore from "../../store/productStore";
import useUserStore from "../../store/userStore";
import Loader from "../../components/common/Loader";
import { showError, showSuccess } from "../../utils/toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { addToCart } = useCartStore();
  const { product, loading, getProductById, rateProduct } = useProductStore();
  const { wishlist, getWishlist, toggleWishlist } = useUserStore();
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (id) {
      getProductById(id);
    }
  }, [id, getProductById]);

  useEffect(() => {
    if (token) {
      getWishlist();
    }
  }, [token, getWishlist]);

  const isWishlisted = useMemo(
    () =>
      wishlist.some(
        (item) => item?._id === product?._id || item === product?._id,
      ),
    [wishlist, product?._id],
  );

  const handleWishlistToggle = async () => {
    if (!token) {
      alert("Please log in to add items to your wishlist.");
      return;
    }

    try {
      const response = await toggleWishlist(product._id);
      showSuccess(response.message);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await addToCart(product._id, 1);
      showSuccess("Product added to cart successfully!");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to add product");
    }
  };

  const handleRateProduct = async (value) => {
    if (!token) {
      alert("Please log in to rate this product.");
      return;
    }

    try {
      await rateProduct(product._id, value);
      setHoveredRating(0);
      showSuccess("Thank you for rating this product!");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to rate product");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link
          to="/products"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Back
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="relative flex min-h-[20rem] items-center justify-center bg-slate-100 p-4 sm:min-h-[26rem] sm:p-8">
              <button
                type="button"
                onClick={handleWishlistToggle}
                className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl shadow-sm transition hover:bg-slate-50"
                aria-label="Toggle wishlist"
              >
                <span
                  className={isWishlisted ? "text-rose-500" : "text-slate-700"}
                >
                  {isWishlisted ? "♥" : "♡"}
                </span>
              </button>

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[530px] w-full object-contain"
                />
              ) : (
                <div className="flex h-[420px] w-full items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                  No Image
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-5 sm:p-8 md:p-10">
              <span className="mb-3 inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
                {product.category?.name || "Category"}
              </span>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRateProduct(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="text-xl transition-transform hover:scale-110"
                      >
                        <span
                          className={
                            star <=
                            (hoveredRating || Number(product.rating || 0))
                              ? "text-amber-400"
                              : "text-slate-300"
                          }
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {Number(product.rating || 0).toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-400">
                    ({product.numReviews || 0} reviews)
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-500">
                  Rate this product
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  ${product.price}
                </span>
                {product.stock > 0 ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    In Stock
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                    Out of Stock
                  </span>
                )}
              </div>

              <p className="mt-6 text-base leading-7 text-slate-600">
                {product.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Availability
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {product.stock > 0
                      ? `${product.stock} units left`
                      : "Unavailable"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Rating
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {product.rating || 4.8}/5
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {product.stock > 0 ? "Add to Cart" : "Unavailable"}
                </button>

                <Link
                  to="/products"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-base font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
