import express from "express";
import { BackendServer } from "./setupServer.js";


class Application{
    start(){
        const app = new express();
        const instance = new BackendServer(app);
        instance.start();
        this.handleExit();
    }
    handleExit() {
        process.on('uncaughtException', (error) => {
          console.log(`There was an uncaught error: ${error}`);
          this.shutDownProperly(1);
        });
    
        process.on('unhandleRejection', (reason) => {
          console.log(`Unhandled rejection at promise: ${reason}`);
          this.shutDownProperly(2);
        });
    
        process.on('SIGTERM', () => {
          console.log('Caught SIGTERM');
          this.shutDownProperly(2);
        });
    
        process.on('SIGINT', () => {
          console.log('Caught SIGINT');
          this.shutDownProperly(2);
        });
    
        process.on('exit', () => {
          console.log('Exiting');
        });
      }
    
       shutDownProperly(exitCode ) {
        Promise.resolve()
          .then(() => {
            console.log('Shutdown complete');
            process.exit(exitCode);
          })
          .catch((error) => {
            console.log(`Error during shutdown: ${error}`);
            process.exit(1);
          });
      }
}

const Server = new Application;
Server.start();
