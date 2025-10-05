import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditItem({ item, onEdit, setShowEditBox }) {
    const [itemData, setItemData] = useState({
        itemname: item.itemname,
        itemprice: item.itemprice,
        itemcategory: item.itemcategory,
        itemimage: item.itemimage,
        itemdescription: item.itemdescription
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.put(
                `http://localhost:5000/api/items/update/${item._id}`,
                itemData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            onEdit();
            setShowEditBox(false);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleChange = (e) => {
        setItemData({
            ...itemData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Item Name</label>
                            <input
                                type="text"
                                name="itemname"
                                value={itemData.itemname}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                name="itemprice"
                                value={itemData.itemprice}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Category</label>
                            <select
                                name="itemcategory"
                                value={itemData.itemcategory}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="">Select category</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                <option value="books">Books</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Image URL</label>
                            <input
                                type="text"
                                name="itemimage"
                                value={itemData.itemimage}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-gray-700 mb-1">Description</label>
                            <textarea
                                name="itemdescription"
                                value={itemData.itemdescription}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-1.5 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowEditBox(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditItem;