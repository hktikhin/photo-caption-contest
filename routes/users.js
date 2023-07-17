const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userService = require('../services/user-service');

/**
 * @swagger
 * /users:
 *    get:
 *      summary: Get all users
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      responses:
 *        "200":
 *          description: returns a list of all users
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/AllUserOutput'
 */
router.get('/', userService.list);


/**
 * @swagger
 * /users/{id}:
 *    get:
 *      summary: Get an individual user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      parameters:
 *        - name: id
 *          description: user id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: returns a user along with their captions
 *          schema:
 *            $ref: '#/components/schemas/UserOut'
 *        "404":
 *          description: User not found
 */
router.get('/:id', userService.getById);

/**
 * @swagger
 * /users:
 *    post:
 *      summary: Creates a new user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      requestBody:
 *        description: Data for new user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *        "201":
 *          description: returns created user
 *          schema:
 *            $ref: '#/components/schemas/AllUserOutput'
 *        "400":
 *          description: Bad request. Missing necessary field
 */
router.post('/', userService.create);

/**
 * @swagger
 * /users/login:
 *    post:
 *      summary: Login to get user's access token
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      requestBody:
 *        description: User data for new user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: testuser@test.com
 *                password:
 *                  type: string
 *                  example: p@ssw0rd
 *      responses:
 *        "200":
 *          description: logs in user and returns access token
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              email:
 *                type: string
 *              name:
 *                type: string
 *              token:
 *                type: string
 *                description: auth token required for performing authenticated actions
 *        "401":
 *          description: incorrect username or password
 */
// Login to get access token/ create login session
router.post('/login', userService.login);

/**
 * @swagger
 * /users/logout:
 *    post:
 *      summary: Logout to expire the access token
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      security:
 *        - ApiKeyAuth: []
 *      responses:
 *        "200":
 *          description: Log user out and expire his access token
 *        "401":
 *          description: Invalid token
 */
router.post('/logout', auth, userService.logout)

/**
 * @swagger
 * /users/{id}:
 *    put:
 *      summary: Updates a user's name or password
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      security:
 *        - ApiKeyAuth: []
 *      parameters:
 *        - name: id
 *          description: user id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      requestBody:
 *        description: Updated user data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: testuser@test.com
 *                password:
 *                  type: string
 *                  example: p@ssw0rd
 *      responses:
 *        "201":
 *          description: returns updated user
 *          schema:
 *            $ref: '#/components/schemas/AllUserOutput'
 *        "401":
 *          description: not authenticated
 *        "403":
 *          description: not authorized
 *        "404":
 *          description: user not found
 */
router.put('/:id', auth, userService.update);

/**
 * @swagger
 * /users/{id}:
 *    delete:
 *      summary: Deletes an user
 *      produces:
 *        - application/json
 *      tags:
 *        - Users
 *      security:
 *        - ApiKeyAuth: []
 *      parameters:
 *        - name: id
 *          description: user id to delete
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "204":
 *          description: User deleted
 *        "401":
 *          description: User not authenticated
 *        "403":
 *          description: User not authorized
 *        "404":
 *          description: User not found
 */
router.delete('/:id', auth, userService.remove);

module.exports = router;

