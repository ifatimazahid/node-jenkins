var createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require("http");
const indexRouter = require("./routes/index");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("./webSockets/sockets");
const { ConversationData } = require("./Models/conversation.model");
const { MessageData } = require("./Models/mesage.model");
const { UserData } = require("./Models/user.model");
const { fromPairs } = require("lodash");
//***** ///// *****//
var app = express();
var io = require("socket.io")();
app.io = io;
mongoose
  .connect(
    "mongodb+srv://abdulbhai:W123456@cluster0-71cfj.mongodb.net/test?retryWrites=true&w=majority"
  )
  .catch((err) => console.error("Could not connect to database...", err));
//***** ///// *****//
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public/images")));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use("/api", indexRouter);
app.use(function (req, res, next) {
  next(createError(404));
});
app.io.on("connection", async function (client) {
  client.on("sign-in", async (e) => {
    let convo = await ConversationData.find();
    app.io.emit("getAll", { conversation: convo });
  });
  client.on("getConvo", async (e) => {});
  client.on("filter-messages", async (e) => {
    let allMessages = await MessageData.find({ conversationId: e });
    app.io.emit("getMessages", allMessages);
  });
  client.on("message", async (e) => {
    let from = e.from;
    let to = e.to;

    let alreadyConvo = await ConversationData.find();

    if (alreadyConvo[0].creator == e.from && alreadyConvo[0].receiver == e.to) {
      let message = {
        conversationId: alreadyConvo[0]._id,
        author: e.from,
        text: e.msg,
      };
      const newMessage = new MessageData(message);
      const messageResult = await newMessage.save();
      app.io.emit("message", { msg: messageResult });
    } else if (
      alreadyConvo[0].receiver == e.from &&
      alreadyConvo[0].creator == e.to
    ) {
      let message = {
        conversationId: alreadyConvo[0]._id,
        author: e.from,
        text: e.msg,
      };
      const newMessage = new MessageData(message);
      const messageResult = await newMessage.save();
      app.io.emit("message", { msg: messageResult });
    } else {
      let newConversation = {
        // _id: items._id,
        convoId: e.from,
        receiver: e.to,
        creator: e.from,
      };
      const conversation = new ConversationData(newConversation);
      var result = await conversation.save();
      let message = {
        // _id: result._id,
        conversationId: result._id,
        author: e.from,
        text: e.msg,
      };
      const newMessage = new MessageData(message);
      const messageResult = await newMessage.save();
      app.io.emit("message", { msg: messageResult });
    }
  });
  client.on("disconnect", function () {
    if (!client.user_id || !clients[client.user_id]) {
      return;
    }
    let targetClients = clients[client.user_id];
    for (let i = 0; i < targetClients.length; ++i) {
      if (targetClients[i] == client) {
        targetClients.splice(i, 1);
      }
    }
  });
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
