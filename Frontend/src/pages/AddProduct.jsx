import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "VrindaVastra",
    material: "100% Cotton",
    stock: "",
    colors: "",
    sizes: [],
  });

  const [images, setImages] = useState([]);

  const categories = [
    "Men",
    "Women",
    "Kids",
    "Home Textile",
  ];

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSizeChange = (size) => {
    if (product.sizes.includes(size)) {
      setProduct({
        ...product,
        sizes: product.sizes.filter((s) => s !== size),
      });
    } else {
      setProduct({
        ...product,
        sizes: [...product.sizes, size],
      });
    }
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("brand", product.brand);
      formData.append("material", product.material);
      formData.append("stock", product.stock);

      formData.append(
        "colors",
        JSON.stringify(product.colors.split(","))
      );

      formData.append(
        "sizes",
        JSON.stringify(product.sizes)
      );

      for (let i = 0; i < images.length; i++) {
        formData.append("image", images[i]);
      }

      await api.post("/products/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product Added Successfully");

      navigate("/products");

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">

        <div className="card shadow p-4">

          <h2 className="mb-4 text-center">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Product Name</label>

              <input
                type="text"
                className="form-control"
                name="name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Description</label>

              <textarea
                className="form-control"
                rows="4"
                name="description"
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Price</label>

                <input
                  type="number"
                  className="form-control"
                  name="price"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Stock</label>

                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="mb-3">

              <label>Category</label>

              <select
                className="form-control"
                name="category"
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}

              </select>

            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Brand</label>

                <input
                  className="form-control"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Material</label>

                <input
                  className="form-control"
                  name="material"
                  value={product.material}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="mb-3">

              <label>Available Sizes</label>

              <div className="d-flex gap-3 mt-2">

                {sizeOptions.map((size) => (

                  <div key={size}>

                    <input
                      type="checkbox"
                      checked={product.sizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                    />

                    {" "} {size}

                  </div>

                ))}

              </div>

            </div>

            <div className="mb-3">

              <label>Colors</label>

              <input
                type="text"
                className="form-control"
                placeholder="White, Black, Blue"
                name="colors"
                onChange={handleChange}
              />

            </div>

            <div className="mb-3">

              <label>Upload Images</label>

              <input
                type="file"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />

            </div>

            <button className="btn btn-dark w-100">
              Add Product
            </button>

          </form>

        </div>

      </div>
    </>
  );
}