import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import useUserStore from "../../store/userStore";
import { showError, showSuccess } from "../../utils/toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { addToCart } = useCartStore();
  const { wishlist, getWishlist, toggleWishlist } = useUserStore();

  useEffect(() => {
    if (token) {
      getWishlist();
    }
  }, [token, getWishlist]);

  const isWishlisted = useMemo(
    () =>
      wishlist.some(
        (item) => item?._id === product._id || item === product._id,
      ),
    [wishlist, product._id],
  );

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleWishlistToggle = async (event) => {
    event.stopPropagation();

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

  const handleAddToCart = async (event) => {
    event.stopPropagation();
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

  const rating = Number(product.rating ?? 0);
  const reviewCount = Number(product.numReviews ?? 0);
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(15,23,42,0.12)]"
    >
      <div className="relative h-44 overflow-hidden rounded-xl bg-slate-100 sm:h-48">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No Image
          </div>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={handleWishlistToggle}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:text-rose-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 ${isWishlisted ? "text-rose-500" : "text-slate-500"}`}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-xs text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= Math.round(rating) ? "" : "opacity-30"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500">
            {rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-slate-400">({reviewCount})</span>
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-bold text-slate-900">
            ${product.price}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {product.stock > 0 ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 2-1.58l1.65-7.42H5.12" />
              </svg>
              Add to Cart
            </>
          ) : (
            "Unavailable"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
