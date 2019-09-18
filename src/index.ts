import { App } from "./app";
import dotenv from 'dotenv';
import { resolve } from "path";
import { startConnection } from "./database";

declare const process: {
    env: {
        NODE_ENV: string;
    }
};


if (process.env.NODE_ENV !== 'production') {    
    dotenv.config({path: resolve(__dirname,'../.env')});
}

async function main() {
    await startConnection();
    const app = new App(3000);
    app.listen();
    console.log('> Environment:', process.env.NODE_ENV);
}

main();