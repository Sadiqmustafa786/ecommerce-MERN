import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import useProductStore from "../../store/productStore";
import useUserStore from "../../store/userStore";
import Loader from "../../components/common/Loader";
import { showError, showSuccess } from "../../utils/toast";

const trustItems = [
  {
    label: "Secure checkout",
    icon: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    label: "Fast delivery",
    icon: (
      <>
        <path d="M3 7h11v12H3zM14 11h4l3 3v5h-7z" />
        <circle cx="7.5" cy="19" r="2" />
        <circle cx="17.5" cy="19" r="2" />
      </>
    ),
  },
  {
    label: "Easy returns",
    icon: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </>
    ),
  },
];

const ChevronDown = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CartIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className="h-5 w-5"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
    <circle cx="10" cy="20" r="1" />
    <circle cx="18" cy="20" r="1" />
  </svg>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { addToCart } = useCartStore();
  const {
    product,
    loading,
    getProductById,
    rateProduct,
    addProductComment,
  } = useProductStore();
  const { wishlist, getWishlist, toggleWishlist } = useUserStore();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    productId: null,
    color: "",
    size: "",
  });
  const selectedColor =
    selectedOptions.productId === product?._id ? selectedOptions.color : "";
  const selectedSize =
    selectedOptions.productId === product?._id ? selectedOptions.size : "";

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
    if (product.colors?.length && !selectedColor) {
      showError("Please select a color");
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      showError("Please select a size");
      return;
    }

    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await addToCart(product._id, 1, {
        color: selectedColor,
        size: selectedSize,
      });
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

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      alert("Please log in to comment on this product.");
      return;
    }

    const text = commentText.trim();

    if (!text) {
      showError("Please write a comment");
      return;
    }

    try {
      setCommentSubmitting(true);
      await addProductComment(product._id, text);
      setCommentText("");
      showSuccess("Your comment was added");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentSubmitting(false);
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
          className="rounded-full bg-[#007979] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-secondary"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50 pb-28 pt-6 sm:pt-10 lg:pb-16">
      {/* soft decorative glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-secondary/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[24rem] w-[24rem] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row: back button + breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:border-secondary hover:text-primary"
          >
            <span aria-hidden="true">←</span> Back
          </button>

          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-2 text-sm text-slate-500 sm:flex">
            <Link to="/" className="transition hover:text-primary">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/products" className="transition hover:text-primary">Products</Link>
            <span aria-hidden="true">/</span>
            <span className="truncate font-semibold text-slate-700">{product.name}</span>
          </nav>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* LEFT: product showcase */}
          <div className="lg:sticky lg:top-28">
            <div className="relative flex min-h-[22rem] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary/10 to-secondary/25 p-6 ring-1 ring-secondary/20 sm:min-h-[34rem] sm:p-10">
              {/* decorative circles */}
              <div className="absolute left-1/2 top-1/2 h-[78%] w-auto -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 aspect-square" />
              <div className="absolute left-1/2 top-1/2 h-[92%] w-auto -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/25 aspect-square" />
              <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-primary/15" />

              {/* category chip */}
              <span className="absolute left-5 top-5 z-10 inline-flex w-fit rounded-full bg-[#007979] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-primary/25">
                {product.category?.name || "Category"}
              </span>

              {/* wishlist */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg shadow-primary/10 transition hover:scale-110"
                aria-label="Toggle wishlist"
                aria-pressed={isWishlisted}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`h-6 w-6 transition ${isWishlisted ? "text-primary" : "text-slate-500"}`}
                  fill={isWishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                >
                  <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                </svg>
              </button>

              {product.image ? (
                <>
                  <div className="absolute bottom-10 left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-[50%] bg-primary/25 blur-xl" />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative z-[1] max-h-[26rem] w-full object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
                  />
                </>
              ) : (
                <div className="relative z-[1] flex h-[420px] w-full items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                  No Image
                </div>
              )}
            </div>

            {/* trust badges */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {trustItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-2 py-4 text-center shadow-sm"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary/10 text-primary">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                  </span>
                  <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT: product info */}
          <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(0,121,121,0.08)] sm:p-8 lg:p-10">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* rating */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-0.5 rounded-full bg-secondary/10 px-3 py-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRateProduct(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    className="p-0.5 transition-transform hover:scale-125"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className={`h-6 w-6 ${
                        star <= (hoveredRating || Number(product.rating || 0))
                          ? "text-secondary"
                          : "text-slate-300"
                      }`}
                      fill="currentColor"
                    >
                      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7L12 2Z" />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">
                {Number(product.rating || 0).toFixed(1)}
              </span>
              <span className="text-sm text-slate-400">
                ({product.numReviews || 0} reviews)
              </span>
              <span className="text-xs font-medium text-slate-400">
                · Tap a star to rate
              </span>
            </div>

            {/* price + stock */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-slate-100 py-5">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                ${product.price}
              </span>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3.5 py-1.5 text-sm font-semibold text-primary">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3.5 py-1.5 text-sm font-semibold text-rose-700">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* description */}
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                About this product
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {product.description}
              </p>
            </div>

            {/* options */}
            {(product.colors?.length > 0 || product.sizes?.length > 0) && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {product.colors?.length > 0 && (
                  <label className="block text-sm font-semibold text-slate-700">
                    Color
                    <div className="relative mt-2">
                      <select
                        value={selectedColor}
                        onChange={(event) =>
                          setSelectedOptions({
                            productId: product._id,
                            color: event.target.value,
                            size: selectedSize,
                          })
                        }
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 font-medium text-slate-900 transition focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/20"
                      >
                        <option value="">Select a color</option>
                        {product.colors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                      <ChevronDown />
                    </div>
                  </label>
                )}

                {product.sizes?.length > 0 && (
                  <label className="block text-sm font-semibold text-slate-700">
                    Size
                    <div className="relative mt-2">
                      <select
                        value={selectedSize}
                        onChange={(event) =>
                          setSelectedOptions({
                            productId: product._id,
                            color: selectedColor,
                            size: event.target.value,
                          })
                        }
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 font-medium text-slate-900 transition focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/20"
                      >
                        <option value="">Select a size</option>
                        {product.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <ChevronDown />
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* info tiles */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary/10 text-primary">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
                    <path d="m3 8 9 5 9-5M12 13v8" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Availability
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    {product.stock > 0
                      ? `${product.stock} units left`
                      : "Unavailable"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary/10 text-primary">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7L12 2Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Rating
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    {product.rating || 4.8}/5
                  </p>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-[#007979] px-6 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:bg-secondary hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:bg-slate-300"
              >
                <CartIcon />
                {product.stock > 0 ? "Add to Cart" : "Unavailable"}
              </button>

              <Link
                to="/products"
                className="inline-flex flex-1 items-center justify-center rounded-2xl border-2 border-secondary/40 bg-white px-6 py-4 text-center text-base font-bold text-primary transition hover:border-secondary hover:bg-secondary/10"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <section
          aria-labelledby="product-comments-heading"
          className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(0,121,121,0.08)] sm:p-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Customer feedback
              </p>
              <h2
                id="product-comments-heading"
                className="mt-1 text-2xl font-extrabold text-slate-900"
              >
                Reviews &amp; comments
              </h2>
            </div>
            <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-primary">
              {product.comments?.length || 0} comments
            </span>
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-6">
            <label
              htmlFor="product-comment"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Share your thoughts
            </label>
            <textarea
              id="product-comment"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="What do you think about this product?"
              className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-4 focus:ring-secondary/15"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {commentText.length}/1000 characters
              </span>
              <button
                type="submit"
                disabled={commentSubmitting || !commentText.trim()}
                className="rounded-full bg-[#007979] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {commentSubmitting ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>

          <div className="mt-7 space-y-4">
            {product.comments?.length ? (
              [...product.comments]
                .sort(
                  (first, second) =>
                    new Date(second.createdAt) - new Date(first.createdAt),
                )
                .map((comment) => (
                  <article
                    key={comment._id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/15 font-bold text-primary">
                        {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-800">
                          {comment.user?.name || "Customer"}
                        </h3>
                        <time
                          dateTime={comment.createdAt}
                          className="text-xs text-slate-400"
                        >
                          {new Date(comment.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </time>
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                      {comment.text}
                    </p>
                  </article>
                ))
            ) : (
              <p className="rounded-2xl bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                No comments yet. Be the first to share your thoughts.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Mobile sticky buy bar (same handler as the main button) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,121,121,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Price
            </p>
            <p className="text-2xl font-extrabold leading-tight text-slate-900">
              ${product.price}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#007979] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-secondary disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none disabled:hover:bg-slate-300"
          >
            <CartIcon />
            {product.stock > 0 ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;