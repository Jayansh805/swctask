import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './Usermodel.js';

export const register = async (req, res) => {
    const { username, email, password, phone } = req.body;
    try {
        console.log("Registering user with:", { username, email, password, phone });
        let user = await User.find({ $or: [{ email }, { username }, { phone }] });
        console.log("Existing user check result:", user);
        if (user.length > 0) {
            console.log("User already exists with given email, username, or phone.");
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log("No existing user found, proceeding with registration.");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword,
            phone
        });
        await user.save();
        console.log("User registered:", user);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({ message: 'Login success', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const fetchProfile = async (req, res) => {
  try {
    console.log("Fetching profile for user ID:", req.user);
    const user = await User.findById(req.user.id); // fetch fresh data from DB
    console.log("User fetched from DB:", user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log("Fetched user profile:", user);
    res.json({ message: `Welcome, ${user.username}`, username: user.username, userId: user._id}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addItem = async (req, res) => {
    const { creator, itemname, itemprice, itemcategory, itemimage, itemdescription } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const newItem = {
            creator,
            itemname,
            itemprice,
            itemcategory,
            itemimage,
            itemdescription
        };
        
        item = new Item(newItem);
        await item.save();
        res.status(201).json({ message: 'Item added successfully', item: newItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

};

export const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};  