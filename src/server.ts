
import errorHandler from 'errorhandler';
import dotenv from 'dotenv';
import app from "./app";

const result = dotenv.config();
if (result.error) {
    dotenv.config({ path: '.env.default' });
}


if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;
