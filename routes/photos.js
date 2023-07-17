const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const photoService = require('../services/photo-service');

/**
 * @swagger
 * /photos:
 *    get:
 *      summary: Get all photos
 *      produces:
 *        - application/json
 *      tags:
 *        - Photos
 *      responses:
 *        "200":
 *          description: returns a list of all photos
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/AllPhotoOutput'
 */
// Get all photos
router.get('/', photoService.list);

/**
 * @swagger
 * /photos/{id}:
 *    get:
 *      summary: Get an individual photo with captions
 *      produces:
 *        - application/json
 *      tags:
 *        - Photos
 *      parameters:
 *        - name: id
 *          description: photo id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: returns a photo with its captions
 *          schema:
 *            $ref: '#/components/schemas/PhotoOutput'
 *        "404":
 *          description: Photo not found
 */
// Get a photo with all captions
router.get('/:id', photoService.getById);


/**
 * @swagger
 * /photos:
 *    post:
 *      summary: Creates a new photo
 *      produces:
 *        - application/json
 *      tags:
 *        - Photos
 *      requestBody:
 *        description: Data for new photo
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreatePhotoInput'
 *      security:
 *        - ApiKeyAuth: []
 *      responses:
 *        "201":
 *          description: returns created photo
 *          schema:
 *            $ref: '#/components/schemas/AllPhotoOutput'
 *        "400":
 *          description: Bad request. Photo url must be unique.
 *        "401":
 *          description: User not authenticated
 */
// Create an new photo
router.post('/', auth, photoService.add);

/**
 * @swagger
 * /photos/{id}:
 *    put:
 *      summary: Updates a photo's data
 *      produces:
 *        - application/json
 *      tags:
 *        - Photos
 *      parameters:
 *        - name: id
 *          description: photo id to update
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      requestBody:
 *        description: Updated photo data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Puppy pic
 *                url:
 *                  type: string
 *                  description: url path to image
 *                  example: https://gph.is/2pGulHk
 *                citation:
 *                  type: string
 *                  example: Giphy
 *      security:
 *        - ApiKeyAuth: []
 *      responses:
 *        "201":
 *          description: returns updated user
 *          schema:
 *            $ref: '#/components/schemas/AllPhotoOutput'
 *        "404":
 *          description: photo not found
 *        "401":
 *          description: User not authenticated
 */
// Update a photo's data 
router.put('/:id', auth, photoService.update);

/**
 * @swagger
 * /photos/{id}:
 *    delete:
 *      summary: Deletes a photo
 *      produces:
 *        - application/json
 *      tags:
 *        - Photos
 *      parameters:
 *        - name: id
 *          description: photo id
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      security:
 *        - ApiKeyAuth: []
 *      responses:
 *        "204":
 *          description: photo deleted
 *        "404":
 *          description: Photo not found
 *        "401":
 *          description: User not authenticated
 */
// Delete a photo's data 
router.delete('/:id', auth, photoService.remove);

module.exports = router;
