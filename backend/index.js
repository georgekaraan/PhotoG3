import "./src/dotenvLoad.js";
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import * as path from "path";

const StartServer = () => {
    const app = express();

    //for serving react files

    app.use(cors());

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use("/api/", router);

    app.use("/", express.static("./public"));
    app.get("*", function(req, res) {
        res.sendFile("index.html", {
            root: path.join(path.resolve(), "./public"),
        });
    });

    return app.listen(process.env.PORT, () => {
        console.log(
            `I WORK. PhotoG3 App listening at http://localhost:${process.env.PORT}`
        );
    });
};

StartServer();
