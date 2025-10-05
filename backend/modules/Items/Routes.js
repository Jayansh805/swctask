import express from 'express';
const router = express.Router();

import { addItem, getItems, deleteItem, updateItem, getItemsById, addToWishlist, getWishlist, removeFromWishlist} from './Controllers.js';
import { requireAuth } from '../../middlewares/auth.js';

router.post('/add',requireAuth, addItem);
router.get('/getallitems', getItems);
router.get('/getitemsbyid/:id', getItemsById);
router.delete('/delete/:id', requireAuth, deleteItem);
router.put('/update/:id', requireAuth, updateItem);
router.post('/wishlist/add', requireAuth, addToWishlist);
router.get('/wishlist', requireAuth, getWishlist);
router.delete('/wishlist/remove/:itemId', requireAuth, removeFromWishlist);



export default router;