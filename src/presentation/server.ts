import * as http from "http";
import express, {NextFunction, Request, Response, Router} from "express";
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/plugins/swagger/swagger.plugin';

export interface ServerOptions{
    port: number;
    routes: Router;
}

export class Server {
    private app = express();
    private http?: http.Server;
    private readonly port: number;
    private readonly routes: Router;

    constructor({routes, port}: ServerOptions){
        this.port = port;
        this.routes = routes;
    }

    public async start(){
        //? Express is framework middleware based

        //* Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));

        //* Extend Middlewares
        this.app.use(morgan("dev"));
        this.app.use(compression({
            //? Sets the compression level (0-9).
            level: 6,
            //? Minimum response size in bytes to compress.
            threshold: '1kb',
        }));

        this.app.use(helmet({
            //* For example, to disable a specific middleware if it causes issues:
            crossOriginEmbedderPolicy: false,
            //* Or to configure Content Security Policy (CSP):
            contentSecurityPolicy: {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "trusted-scripts.com"],
              },
            },
        }));

        //* Cors
        this.app.use(cors({
            origin: '*',
            methods: ['GET','POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        
        //* Routes
        this.app.use(this.routes);

        //* Swagger
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        //* Error Handling 
        this.routes.use(
            (err: any, req: Request, res: Response, next: NextFunction) => {
                console.error(err);
                res.status(500).json({message: "Internal Serve Error"});
            }
        );

        //* 404 Handling
        this.app.use((req, res) => {
            res.status(404).json({message: "Not Found"});
        });

        //* Start Server
        this.http = this.app.listen(this.port, () => {
            console.log(`Serve is running  on http://localhost:${this.port}`);
        })
    }

    public get httpServer(): http.Server {
        if(!this.http){
            throw new Error("HTTP server isn't running");
        }
        return this.http;
    }

    public async stop(){
        try{
            this.http?.close;
            console.log("Sever is stopped");
        }catch(error){
            throw `Error: Failed to stop server\n ${error}`;
        }
    }

}