import express from 'express';
import { getRooms, getRoom, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';

const router = express.Router({ mergeParams: true });

router
  .route('/',verifyToken, verifyAdmin, createRoom)
  .get(getRooms)
  .post(verifyToken, verifyAdmin, createRoom);

router
  .route('/:id')
  .get(getRoom)
  .put(verifyToken, verifyAdmin, updateRoom)
  .delete(verifyToken, verifyAdmin, deleteRoom);

export default router;
