import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct(){
    const { id } = useParams();
    console.log("ID from URL:", id);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
    });

    const allowedFields = ["title", "description", "price", "category", "image", "stock"];
    
    const loadProduct = async () => {
        try{
        const res = await api.get('/products');
        console.log("All Products:", res.data);
        console.log("ID from URL:", id);
        const product = res.data.find((p) => p._id === (id));
        console.log("Found Product:", product);
        if (product){
            setForm(product);
        }
        } catch (error) {
            console.log("LOAD PRODUCT ERROR:", error);
        }
    }

    useEffect(() => {
        loadProduct();
    }, []);
    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
    });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await api.put(`/products/update/${id}`,form);
            alert("Product Updated successfullt!");
            navigate("/admin/products");
        } catch(error) {
            console.log(error.response?.data);
            console.log(error);
        }
    }

    return(
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                {
                     allowedFields.map((key) => (
                        allowedFields.includes(key) &&
                        <input
                        key={key}
                        name = {key}
                        value={form[key]}
                        onChange={handleChange}
                        placeholder={key}
                        className="w-full p-2 border border-gray-300 rounded"
                        />
                    ))
                }
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rpunded hover:bg-blue-600">
                    Update Product
                </button>
            </form>
        </div>
    )
}