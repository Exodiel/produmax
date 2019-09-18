import mongoose from "mongoose";

declare const process: {
  env: {
    MONGODB_URI: string;
  }
};

export async function startConnection() {
  try {
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("> Mongo Connection Established");
    });
    connection.on("reconnected", () => {
      console.log("> Mongo Connection Reestablished");
    });
    connection.on("disconnected", () => {
      console.log("> Mongo Connection Disconnected");
      console.log("> Trying to reconnect to Mongo ...");
      setTimeout(() => {
        mongoose.connect(process.env.MONGODB_URI, {
          autoReconnect: true,
          keepAlive: true,
          socketTimeoutMS: 3000,
          connectTimeoutMS: 3000
        });
      }, 3000);
    });
    connection.on("close", () => {
      console.log("> Mongo Connection Closed");
    });
    connection.on("error", (error: Error) => {
      console.log("> Mongo Connection ERROR: " + error);
    });
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log("> Database is connected");
  } catch (error) {
    console.error(error);
  }
}
