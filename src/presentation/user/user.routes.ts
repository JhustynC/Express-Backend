import { GetUser } from './../../domain/use-cases/user/get-user.use-case';
import { Router } from "express";
import { UserDatasourceImp } from "../../infrastructure/datasources/mongo.datasource.imp";
import { UserRepositoryImp } from "../../infrastructure/repositories/mongo.repository.imp";
import { UserController } from "./user.controller";

export class UserRoutes {
    static get routes(): Router {
        const router = Router();
        const userDatasource = new UserDatasourceImp();
        const userRepository =  new UserRepositoryImp(userDatasource);
        const userController = new UserController(userRepository);

        /**
         * @swagger
         * /user:
         *   get:
         *     summary: Get all users
         *     responses:
         *       200:
         *         description: List of users
         */
        router.get('/', userController.getUsers);

        /**
         * @swagger
         * /user/{email}:
         *   get:
         *     summary: Get a user by email
         *     parameters:
         *       - in: path
         *         name: email
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: User found
         *       404:
         *         description: User not found
         */
        router.get('/:email', userController.getUser);

        /**
         * @swagger
         * /user:
         *   post:
         *     summary: Create a new user
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *               email:
         *                 type: string
         *               password:
         *                 type: string
         *     responses:
         *       200:
         *         description: User created
         *       400:
         *         description: Invalid data
         */
        router.post('/', userController.createUser);

        /**
         * @swagger
         * /user/{email}:
         *   put:
         *     summary: Update a user
         *     parameters:
         *       - in: path
         *         name: email
         *         required: true
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *               password:
         *                 type: string
         *     responses:
         *       200:
         *         description: User updated
         *       404:
         *         description: User not found
         */
        router.put('/:email', userController.updateUser);

        /**
         * @swagger
         * /user/{email}:
         *   delete:
         *     summary: Delete a user
         *     parameters:
         *       - in: path
         *         name: email
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: User deleted
         *       404:
         *         description: User not found
         */
        router.delete('/:email', userController.deleteUser);

        /**
         * @swagger
         * /user/{email}:
         *   post:
         *     summary: Verify a user's password
         *     parameters:
         *       - in: path
         *         name: email
         *         required: true
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               password:
         *                 type: string
         *     responses:
         *       200:
         *         description: Correct password
         *       401:
         *         description: Incorrect password
         *       404:
         *         description: User not found
         */
        router.post('/:email', userController.checkPassword);
     
        return router;
    }    
}