import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddItem(props) {
    const [itemname,setItemname] = useState("");
    const [itemprice,setItemprice] = useState("");
    const [itemcategory,setItemcategory] = useState("");
    const [itemimage,setItemimage] = useState("");
    const [itemdescription,setItemdescription] = useState("");

    const navigate = useNavigate();

    const handlesubmit = async(e) => {

        e.preventDefault();
        const token = localStorage.getItem('token');
        try{
            const response = await axios.post('http://localhost:5000/api/items/add', {
                creator: "",  // The backend will set this based on the authenticated user
                itemname,
                itemprice,
                itemcategory,
                itemimage,
                itemdescription
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Item added successfully:", response.data);
            alert("Item added successfully.");
            props.onAdd(); // Call the onAdd function passed via props to refresh the item list
            // Optionally, reset the form fields
            props.setShowbox(false); // Close the AddItem box
            setItemname("");
            setItemprice("");
            setItemcategory("");
            setItemimage("");
            setItemdescription("");
            // Navigate to profile or another page if needed
            // navigate('/profile');
        }
        catch(err){
            alert("Failed to add item.");
            console.error(err);
        }
    }

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <form className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-3xl w-2xl" onSubmit={handlesubmit}>
                <h2 className="text-2xl font-bold mb-4 text-center">Add New Item</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1" htmlFor="itemName">Item Name</label>
                        <input
                            type="text"
                            id="itemName"
                            className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter item name"
                            value={itemname}
                            onChange={(e) => setItemname(e.target.value)}
                            required
                        />
                    </div>  
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1" htmlFor="itemPrice">Item Price</label>
                        <input
                            type="number"
                            id="itemPrice"
                            className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter item price"
                            value={itemprice}
                            onChange={(e) => setItemprice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1" htmlFor="itemCategory">Category</label>
                        <select
                            id="itemCategory"
                            className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            value={itemcategory}
                            onChange={(e) => setItemcategory(e.target.value)}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="books">Books</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1" htmlFor="itemImage">Item Image URL</label>
                        <input
                            type="text"
                            id="itemImage"
                            className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter item image URL"
                            value={itemimage}
                            onChange={(e) => setItemimage(e.target.value)}
                        />
                    </div>
                    <div className="col-span-2 mb-3">
                        <label className="block text-gray-700 mb-1" htmlFor="itemDescription">Item Description</label>
                        <textarea
                            id="itemDescription"
                            className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter item description"
                            rows="3"
                            value={itemdescription}
                            onChange={(e) => setItemdescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                <button 
                    className=" px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                    onClick={() => props.setShowbox(false)}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                    Add Item
                </button>
                </div>
            </form>

            {/* <div className="max-w-3xl w-2xl mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Live Preview</h2>
                <div className="border p-4 rounded">
                    <h3 className="text-xl font-semibold mb-2">{itemname}</h3>
                    <p className="text-gray-700 mb-1">Category: <span className="font-medium">{itemcategory}</span></p>
                    <p className="text-gray-700 mb-1">Price: <span className="font-medium">Rs.{itemprice}</span></p>
                    <p className="text-gray-700 mb-2">Description: <span className="font-medium">{itemdescription}</span></p>
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                        Image Preview
                    </div>
                </div>
            </div> */}
            </div>
    );
}

export default AddItem;