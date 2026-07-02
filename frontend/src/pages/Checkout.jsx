import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const userId = localStorage.getItem("userId");

  const [address, setAddress] = useState([]);
  const [selectAddress, setSelectAddress] = useState(null);
  const [cart, setCart] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cartRes = await api.get(`/cart/${userId}`);
      setCart(cartRes.data);

      const addressRes = await api.get(`/address/${userId}`);
      setAddress(addressRes.data);

      if (addressRes.data.length > 0) {
        setSelectAddress(addressRes.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectAddress) {
        alert("Please select an address");
        return;
      }

      const res = await api.post("/order/place", {
        userId,
        address: selectAddress,
      });

      alert("Order Placed Successfully");

      console.log(res.data);
      console.log(res.data.orderId);

      navigate(`/order-success/${res.data.orderId}`);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Order Failed");
    }
  };

  if (!cart) {
    return <div>Loading...</div>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * (item.productId?.price || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <h2 className="font-semibold mb-2">Select Address</h2>

      {address.map((addr) => (
        <label
          key={addr._id}
          className="block border p-3 rounded mb-3 cursor-pointer"
        >
          <input
            type="radio"
            name="address"
            checked={selectAddress?._id === addr._id}
            onChange={() => setSelectAddress(addr)}
            className="mr-2"
          />

          <strong>{addr.fullName}</strong>

          <p>
            {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
          </p>

          <p>{addr.phone}</p>
        </label>
      ))}

      <h2 className="font-semibold mt-6 mb-2">Order Summary</h2>

      <p className="text-lg font-semibold">
        Total Amount : ₹{total}
      </p>

      <button
        onClick={placeOrder}
        className="mt-4 w-full bg-green-500 text-white p-3 rounded"
      >
        Place Order (COD)
      </button>
    </div>
  );
}