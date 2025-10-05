import Item from './Itemmodel.js';
import User from '../auth/Usermodel.js';
import Wish from './WishlistModel.js';

export const addItem = async (req, res) => {
    const { creator, itemname, itemprice, itemcategory, itemimage, itemdescription } = req.body;
    try {
        const user = await User.findById(req.user.id);
        console.log("Authenticated user:", req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const newItem = {
            creator:user._id,
            itemname,
            itemprice,
            itemcategory,
            itemimage,
            itemdescription
        };
        
        let item = new Item(newItem);
        console.log("New item to be saved:", item);
        await item.save();
        console.log("Item saved successfully:", item);
        res.status(201).json({ message: 'Item added successfully', item: newItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

};

export const getItems = async (req, res) => {
    try {
        const items = await Item.find().populate('creator');
        res.status(200).json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};  

export const getItemsById = async (req, res) => {
    const userId = req.params.id;
    try {
        const items = await Item.find({ creator: userId }).populate('creator');
        res.status(200).json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};  

export const deleteItem = async (req, res) => {
    const itemId = req.params.id;
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        if (item.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Item.findByIdAndDelete(itemId);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateItem = async (req, res) => {
    const itemId = req.params.id;
    const { itemname, itemprice, itemcategory, itemimage, itemdescription } = req.body;
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        // Check if the authenticated user is the creator of the item
        if (item.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        item.itemname = itemname || item.itemname;
        item.itemprice = itemprice || item.itemprice;
        item.itemcategory = itemcategory || item.itemcategory;
        item.itemimage = itemimage || item.itemimage;
        item.itemdescription = itemdescription || item.itemdescription;
        await item.save();
        res.status(200).json({ message: 'Item updated successfully', item });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addToWishlist = async (req, res) => {
    const {itemId} = req.body;
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const wish = await Wish.findOne({ item: itemId });
        if (wish) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        } else {
            const newWish = new Wish({
                creator: user._id,
                item: item._id
            });
            await newWish.save();
            res.status(201).json({ message: 'Item added to wishlist', wish: newWish });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

};

export const getWishlist = async (req, res) => {
    try {
        const wishes = await Wish.find({ creator: req.user.id }).populate('item creator');
        res.status(200).json({ wishes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const removeFromWishlist = async (req, res) => {
    const itemId = req.params.itemId;
    try {
        const wish = await Wish.findOne({ creator: req.user.id, item: itemId });
        if (!wish) {
            return res.status(404).json({ message: 'Item not in wishlist' });
        }
        await Wish.findByIdAndDelete(wish._id);
        res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

