import express from 'express';

const router = express.Router();

router.post('/create-user', UserController.createUser);

router.get('/', UserController.getAllUsers);

export const UserRoutes = router;