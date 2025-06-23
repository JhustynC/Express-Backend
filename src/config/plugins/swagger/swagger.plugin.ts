import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend Review API',
            version: '1.0.0',
            description: 'API for user management'
        }
    },
    apis: ['./src/presentation/user/user.routes.ts']
};

export const swaggerSpec = swaggerJSDoc(options); 