import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove invalid products
      const validWishlist = res.data.filter((item) => item.product);

      setWishlist(validWishlist);
    } catch (err) {
      console.log(err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/wishlist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchWishlist();
    } catch (err) {
      console.log(err);
    }
  };

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
        <h2 className="fw-bold mb-4">❤️ My Wishlist</h2>

        {wishlist.length === 0 ? (
          <div className="alert alert-warning">
            Your wishlist is empty.
          </div>
        ) : (
          <div className="row">
            {wishlist.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card shadow h-100">

                  <img
                    src={
                      Array.isArray(item.product.image)
                        ? `http://localhost:5000/uploads/${item.product.image[0]}`
                        : `http://localhost:5000/uploads/${item.product.image}`
                    }
                    alt={item.product.name}
                    className="card-img-top"
                    style={{
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="card-body">
                    <h5>{item.product.name}</h5>

                    <h4 className="text-success">
                      ₹{item.product.price}
                    </h4>

                    <p>{item.product.category}</p>

                    <button
                      className="btn btn-danger w-100"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}