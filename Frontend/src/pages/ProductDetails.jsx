import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://e-commerce-website-vrindavastra-2.onrender.com";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] =useState("M");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please Login First");
        return;
      }

      await api.post(
        "/cart",
        {
          product: product._id,
          quantity,
          size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Added To Cart");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const addToWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please Login First");
        return;
      }

      await api.post(
        "/wishlist",
        {
          product: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added To Wishlist");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <h3>Loading...</h3>
        </div>
      </>
    );
  }

  const imageUrl =
    product.image && product.image.length > 0
      ? `${BASE_URL}/uploads/${product.image[0]}`
      : "https://via.placeholder.com/500x600?text=No+Image";

  return (
    <>
      <div className="container my-5">
        <div className="row">

          {/* Image */}
          <div className="col-md-6 text-center">
            <img
              src={imageUrl}
              alt={product.name}
              className="img-fluid rounded shadow"
              style={{
                maxHeight: "500px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Details */}
          <div className="col-md-6">
            <h2>{product.name}</h2>

            <h3 className="text-success mb-3">
              ₹{product.price}
            </h3>

            <p>{product.description}</p>

            <p>
              <strong>Category:</strong> {product.category}
            </p>

            <div className="mt-4">
              <h5>Select Size</h5>

              <div className="d-flex gap-2 flex-wrap">
                {["S", "M", "L", "XL", "XXL"].map((item) => (
                  <button
                    key={item}
                    className={`btn ${
                      size === item
                        ? "btn-dark"
                        : "btn-outline-dark"
                    }`}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h5>Quantity</h5>

              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-dark"
                  onClick={() =>
                    quantity > 1 &&
                    setQuantity(quantity - 1)
                  }
                >
                  -
                </button>

                <span className="mx-4 fs-4">
                  {quantity}
                </span>

                <button
                  className="btn btn-outline-dark"
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5">
              <button
                className="btn btn-dark btn-lg me-3"
                onClick={addToCart}
              >
                🛒 Add To Cart
              </button>

              <button
                className="btn btn-outline-danger btn-lg"
                onClick={addToWishlist}
              >
                ❤️ Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;