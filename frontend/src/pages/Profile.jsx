import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AddItem from '../components/AddItem';
import EditItem from '../components/EditItem';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { getWishlist } from '../../../backend/modules/Items/Controllers';
import { get } from 'mongoose';

function Profile(props) {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [items, setItems] = useState([]);
    const [showbox, setShowbox] = useState(false);
    const [userId, setUserId] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [wishlist, setWishlist] = useState([]);

    const fetchProfile = async () => {
        console.log("Fetching profile data...");
        const token = localStorage.getItem('token');

        try {
            const res = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Profile data fetched:", res);
            setMessage(res.data.message);
            setUsername(res.data.username);
            setUserId(res.data.userId);
            getItems(res.data.userId); // Fetch items for the user
            getWishlist(); // Fetch wishlist for the user
        } catch (err) {
            console.error(err);
            setMessage('Unauthorized');
        }
    };

    const getItems = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`http://localhost:5000/api/items/getItemsById/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Items fetched:", res.data.items);
            setItems(res.data.items);
        } catch (err) {
            console.error("Failed to fetch items:", err);
        }
    };

    const handledelete = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/items/delete/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Item deleted:", itemId);
            // Refresh the item list after deletion
            getItems();
        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    };

    const getWishlist = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/items/wishlist', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Wishlist fetched:", res.data.wishes);
            setWishlist(res.data.wishes);
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        }
    };

    const deletewishitem = async(itemId)=>{
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/items/wishlist/remove/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Item deleted from wishlist:", itemId);
            // Refresh the item list after deletion
            getWishlist();
        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    useEffect(() => {
        fetchProfile();
        getWishlist();
    }, []);

    return (
        <>
            {message == 'Unauthorized' ? (
                <>
                    <Navbar isAuth={false} username={username} />
                    <div className="flex items-center justify-center min-h-screen bg-gray-100">
                        <h2 className="text-3xl font-bold text-red-600">Unauthorized Access. Please log in.</h2>
                    </div>
                </>
            ) : (
                <div className="bg-gray-100 min-h-screen" >
                    <Navbar isAuth={true} username={username} />
                    <button 
                        className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200 group" 
                        onClick={() => setShowbox(!showbox)}
                    >
                        <Plus className="group-hover:rotate-90 transition-transform duration-200" size={20} />
                        <span className="font-medium">Add Item</span>
                    </button>
                    {showbox && <AddItem onAdd={getItems} setShowbox={setShowbox}/>}

                    <div className="bg-gray-100 p-4">
                        <h2 className="text-2xl font-bold mb-6 text-center">Your Wishlist</h2>
                        {wishlist.length === 0 ? (
                            <p className="text-center text-gray-600">Your wishlist is empty.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {wishlist.map((wish) => (
                                    <div key={wish._id} className="bg-white p-4 rounded-lg shadow-md">
                                        <img src={wish.item.itemimage} alt={wish.item.itemname} className="w-full h-48 object-cover mb-4 rounded" />
                                        <h3 className="text-lg font-semibold mb-2">{wish.item.itemname}</h3>
                                        <p className="text-gray-600 mb-2">Price: ${wish.item.itemprice}</p>
                                        <p className="text-gray-600 mb-2">Category: {wish.item.itemcategory}</p>
                                        <p className="text-gray-600">{wish.item.itemdescription}</p>
                                        <div className="mt-4">
                                            <button
                                                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors duration-200"
                                                onClick={()=>deletewishitem(wish.item._id)}
                                                >
                                                Remove from Wishlist
                                            </button>
                                            </div>
                                        </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-100 p-4">
                        <h2 className="text-2xl font-bold mb-4 text-center">Your Items</h2>
                        {items.length === 0 ? (
                            <p className="text-center text-gray-600">No items found.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {items.map((item) => (
                                    <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
                                        <img src={item.itemimage} alt={item.itemname} className="w-full h-48 object-cover mb-4 rounded" />
                                        <h3 className="text-lg font-semibold mb-2">{item.itemname}</h3>
                                        <p className="text-gray-600 mb-2">Price: ${item.itemprice}</p>
                                        <p className="text-gray-600 mb-2">Category: {item.itemcategory}</p>
                                        <p className="text-gray-600">{item.itemdescription}</p>
                                        <div className="mt-4 flex gap-2">
                                            <button 
                                                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors duration-200"
                                                onClick={() => handledelete(item._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {editingItem && (
                        <EditItem
                            item={editingItem}
                            onEdit={() => {
                                getItems(userId);
                                setEditingItem(null);
                            }}
                            setShowEditBox={setEditingItem}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default Profile;