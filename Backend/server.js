import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors"

//app config
const app = express();
const port = process.env.PORT || 9000
const connectionUrl = "mongodb+srv://root:root@cluster0.qvfum.mongodb.net/whatsappdb?retryWrites=true&w=majority";
const pusher = new Pusher({
    appId: "1183684",
    key: "bf24836fad5569d93ee1",
    secret: "564dc13d04bf5fa5f561",
    cluster: "ap2",
    useTLS: true
});

const db = mongoose.connection;
db.once("open", () => {
    console.log("DB Connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log(change);

        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                receiver: messageDetails.receiver,
            })
        } else {
            console.log("Error triggering Pusher")
        }
    })
})

//middleware
app.use(express.json());
app.use(cors());


//DB Config
mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//api routes
app.get("/", (req, res) => res.status(201).send("Hello World"));

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

app.get("/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data);
        }
    })
});

//listen
app.listen(port, () => console.log(`Listening to port: ${port}`));
