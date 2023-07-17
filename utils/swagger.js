
const swagger = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
        title: "Caption Contest",
        version: "1.0.0",
        description:
            "Simple backend API to allow users to add captions to photos",
        license: {
            name: "MIT",
            url: "https://choosealicense.com/licenses/mit/"
        }
        }
    },
    apis: [
        './utils/swagger.js',
        './db/models/photo.js',
        './db/models/user.js',
        './db/models/caption.js',
        './routes/users.js',
        './routes/photos.js',
        './routes/captions.js'
    ]
};

const specs = swagger(swaggerOptions);

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      ApiKeyAuth:        
 *          type: apiKey
 *          in: header       
 *          name: authorization
 */


module.exports = (app) => {
    // swagger page
    app.use("/docs", swaggerUi.serve);
    app.get(
        "/docs",
        swaggerUi.setup(specs, {
            explorer: true
        })
    );
    // docs in json format
    app.get("docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json")
        res.send(specs)
    });
}
