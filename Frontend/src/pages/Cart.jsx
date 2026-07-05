import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove invalid products
      const validCart = res.data.filter((item) => item.product);

      setCart(validCart);
    } catch (err) {
      console.log(err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (item) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/cart",
        {
          product: item.product._id,
          quantity: 1,
          size: item.size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const totalPrice = cart.reduce((total, item) => {
    if (!item.product) return total;
    return total + item.product.price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>

      <div className="container my-5">
        <h2 className="fw-bold mb-4">🛒 Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="alert alert-warning">
            Your cart is empty.
          </div>
        ) : (
          <div className="row">

            <div className="col-lg-8">

              {cart.map((item) => (
                <div
                  className="card mb-3 shadow-sm"
                  key={item._id}
                >
                  <div className="row g-0">

                    <div className="col-md-3">

                      <img
                        src={`http://localhost:5000/uploads/${item.product.image}`}
                        alt={item.product.name}
                        className="img-fluid rounded-start"
                        style={{
                          height: "200px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />

                    </div>

                    <div className="col-md-9">

                      <div className="card-body">

                        <h4>{item.product.name}</h4>

                        <h5 className="text-success">
                          ₹{item.product.price}
                        </h5>

                        <p>
                          <strong>Size:</strong> {item.size}
                        </p>

                        <p>
                          <strong>Quantity:</strong> {item.quantity}
                        </p>

                        <button
                          className="btn btn-outline-success me-2"
                          onClick={() => increaseQuantity(item)}
                        >
                          +
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() => removeItem(item._id)}
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>
                </div>
              ))}

            </div>

            <div className="col-lg-4">

              <div className="card shadow">

                <div className="card-body">

                  <h3>Order Summary</h3>

                  <hr />

                  <h4>Total ₹{totalPrice}</h4>

                  <Link
                    to="/checkout"
                    className="btn btn-success w-100 mt-3"
                  >
                    Proceed To Checkout
                  </Link>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}