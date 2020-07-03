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
    await ConversationData.find()
      .populate({
        path: "receiver",
        model: "users",
      })
      .populate({
        path: "creator",
        model: "users",
      })
      .exec(function (err, data) {
        console.log(data, "ssssssssssssssss");
        app.io.emit("getAll", { conversation: data });
      });
  });
  client.on("getConvo", async (e) => {
    let convo = await ConversationData.find();

    // console.log("<>", e);

    convo.map((v) => {
      if (
        (v.creator === e.currentUser && v.receiver === e.receiver) ||
        (v.creator === e.currentUser && v.receiver === v.currentUser)
      ) {
        // (v.creator === e.currentUser && v.receiver === e.receiver)

        console.log(v);
        // app.io.emit("getConversationId", { conversation: convo });
      }
    });
  });

  client.on("filter-messages", async (e) => {
    // let alreadyConvo = await // ConversationData.find({
    // //   creator: from,
    // //   receiver: to,
    // // });
    // ConversationData.findById(e);
    // if (alreadyConvo.creator == userId || alreadyConvo.receiver == userId) {
      // console.log(alreadyConvo, "oooooooooooo111111111ooooooooooo");
      let allMessages = await MessageData.find({
        conversationId: e
      });
      app.io.emit("getMessages", allMessages);
    // }
  });

  client.on("message", async (e) => {
    let from = e.from;
    let to = e.to;
    // let alreadyConvo = await ConversationData.find({ creator: from });

    let alreadyConvo = await // ConversationData.find({
    //   creator: from,
    //   receiver: to,
    // });
    ConversationData.find({
      $and: [
        {
          $or: [{ creator: from }, { creator: to }],
        },
        { $or: [{ receiver: from }, { receiver: to }] },
      ],
    });
    // let alreadyChat = await ConversationData.find({
    //   creator: to,
    //   receiver: from,
    // });
    if (alreadyConvo.length) {
      let message = {
        conversationId: alreadyConvo[0]._id,
        author: e.from,
        text: e.msg,
      };
      const newMessage = new MessageData(message);

      const messageResult = await newMessage.save();
      app.io.emit("messageSave", { msg: messageResult });

      // app.io.emit("message", { msg: messageResult });
      //  else if (
      //   alreadyChat[0].receiver == e.from &&
      //   alreadyChat[0].creator == e.to
      // ) {
      //   let message = {
      //     conversationId: alreadyChat[0]._id,
      //     author: e.from,
      //     text: e.msg,
      //   };
      //   const newMessage = new MessageData(message);
      //   const messageResult = await newMessage.save();
      //   app.io.emit("message", { msg: messageResult });
      // }
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
      app.io.emit("messageSave", { msg: messageResult });

      //
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
