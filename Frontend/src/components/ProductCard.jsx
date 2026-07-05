import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm border-0 rounded-4">

        {/* Product Image */}
        <img
          src={
            product.image && product.image.length > 0
              ? `http://localhost:5000/uploads/${product.image[0]}`
              : "https://via.placeholder.com/300x350"
          }
          alt={product.name}
          className="card-img-top"
          style={{
            height: "300px",
            objectFit: "cover",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        />

        <div className="card-body">

          <span className="badge bg-success mb-2">
            {product.category}
          </span>

          <h5 className="fw-bold">
            {product.name}
          </h5>

          <p className="text-muted mb-1">
            {product.brand}
          </p>

          <p className="text-secondary mb-2">
            {product.material}
          </p>

          <h4 className="text-danger">
            ₹{product.price}
          </h4>

          <div className="mb-3">
            ⭐ {product.rating || 5} / 5
          </div>

          <Link
            to={`/product/${product._id}`}
            className="btn btn-dark w-100"
          >
            View Details
          </Link>

        </div>
      </div>
    </div>
  );
}