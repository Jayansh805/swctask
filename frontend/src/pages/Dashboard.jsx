import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import { use } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard(props) {
    const tkn = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [items, setItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);

    const handleaddtowishlist = async (itemId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to add items to wishlist");
            return;
        }

        try {

            await axios.post('http://localhost:5000/api/items/wishlist/add', { itemId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setWishlistItems([...wishlistItems, itemId]);
            alert("Item added to wishlist");
        } catch (err) {
            console.error("Failed to add item to wishlist:", err);
            alert("Failed to add item to wishlist");
        }
    };

    const fetchWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axios.get('http://localhost:5000/api/items/wishlist', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('fetched wishlist data: ', res.data.wishes);
            const wisheslist = res.data.wishes.map(item => item._id);
            console.log(wisheslist);
            setWishlistItems(wisheslist);
            console.log('fetched wishlist: ', wishlistItems);
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        }
    };

    const getItems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/items/getallitems');
            console.log("Items fetched:", res.data.items);
            setItems(res.data.items);
        } catch (err) {
            console.error("Failed to fetch items:", err);
        }
    };

    // useEffect(() => {
    //     console.log("Wishlist items updated:", wishlistItems);
    // }, [wishlistItems]);


    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching dashboard data...");
            try {
                await fetchWishlist(); 
                console.log('wishlist in useefffect', wishlistItems);
                await getItems();     
            } catch (err) {
                console.error("Failed fetching dashboard data:", err);
            }
        };

        fetchData();
    }, []);


    const navigate = useNavigate();
    const { logout } = useAuth();
    return (
        <>
            {tkn ? (
                <Navbar isAuth={true} username={username} />
            ) : (
                <Navbar isAuth={false} />
            )}

            <div className="bg-gray-100 min-h-screen p-4">
                <h2 className="text-3xl font-bold mb-6 text-center">All Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
                            <img src={item.itemimage} alt={item.itemname} className="w-full h-48 object-cover mb-4 rounded" />
                            <h3 className="text-xl font-semibold mb-2">{item.itemname}</h3>
                            <p className="text-gray-600 mb-2">Price: ${item.itemprice}</p>
                            <p className="text-gray-600 mb-2">Category: {item.itemcategory}</p>
                            <p className="text-gray-600 mb-2">Posted by: {item.creator.username}</p>
                            <p className="text-gray-700">{item.itemdescription}</p>
                            {tkn ? (
                                wishlistItems.includes(item._id) ? (
                                    <button
                                        disabled
                                        className="mt-4 w-full bg-gray-500 text-white py-2 rounded cursor-not-allowed opacity-75 flex items-center justify-center gap-2"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Added to Wishlist
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleaddtowishlist(item._id)}
                                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        Add to Wishlist
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="mt-4 w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition-colors duration-200"
                                >
                                    Login to Add to Wishlist
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
}

export default Dashboard;

