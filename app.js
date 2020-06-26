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
// app.use("/",socket)

app.io.on("connection", async function (client) {
  client.on("sign-in", async (e) => {
    let convo = await ConversationData.find({ members: e._id });

    app.io.emit("getAll", { conversation: convo });
  });
  client.on("getConvo", async (e) => {});

  client.on("filter-messages", async (e) => {
    console.log(e);

    let allMessages = await MessageData.find({ conversationId: e });
    // let allMessages = await MessageData.find().limit(1).sort({ $natural: -1 });

    // let test = await MessageData.find().sort({ _id: -1 }).limit(1);

    // console.log("<<<", test, "??");

    app.io.emit("getMessages", allMessages);
  });
  client.on("getConvo", async e => {

  client.on("message", async (e) => {
    // let from = e.from;
    // let to = e.to;

    let from = [e.from, e.to];
    let to = [e.to, e.from];

    let alreadyConvo = await ConversationData.find({ members: from });
    let alreadyChat = await ConversationData.find({ members: to });

    // console.log(from, "from");

    // alreadyConvo.map((v) => {
    //   if (
    //     (v.members[0] === e.from && v.members[1] === e.to) ||
    //     (v.members[0] === e.to && v.members[1] === e.from)
    //   ) {
    //     console.log("1 matched");
    //   }
    // });

    // let alreadyChat = await ConversationData.find({
    //   members: to,
    // });

    if (alreadyChat.length) {
      alreadyChat.filter(async (items) => {
        if (items._id) {
          let message = {
            conversationId: items._id,
            author: e.from,
            text: e.msg,
          };

          const newMessage = new MessageData(message);
          const messageResult = await newMessage.save();
          app.io.emit("message", { msg: messageResult });
        }
      });
    } else {
      let newConversation = {
        // _id: items._id,
        convoId: e.from,
        members: [e.from, e.to],
        creator: e.from,
      };
      const conversation = new ConversationData(newConversation);

      var result = await conversation.save();

      // let alreadyChat = await MessageData.find({
      //   convoId: e,
      // }).populate("conversations");

      let message = {
        conversationId: result._id,
        author: e.from,
        text: e.msg,
      };

      const newMessage = new MessageData(message);
      const messageResult = await newMessage.save();
      app.io.emit("message", { msg: messageResult });
    }
    const conversation = new ConversationData(newConversation)
    // try {
      var result =await conversation.save();
      console.log(result, "res")
      let message = {
        conversationId: result._id,
        author: e.from,
        content: e.msg
      }
      const newMessage = new MessageData(message)
      const messageResult =await newMessage.save()
      app.io.emit("message", { msg: messageResult })
    // }
    // const convo = await ConversationData.find({creator:e.from})
    // console.log(e)
    // let sourceId = client.user_id;
    // console.log(client.user_id,clients)
    // cli.emit("message", e);
    // if(targetId && clients[targetId]) {
    //   clients[targetId].forEach(cli => {
    //     console.log("asasas",cli)
    //     cli.emit("message", e);
    //   });
    // }

    if (alreadyConvo.length) {
      alreadyConvo.filter(async (items) => {
        if (items._id) {
          let message = {
            conversationId: items._id,
            author: e.from,
            text: e.msg,
          };

          const newMessage = new MessageData(message);
          const messageResult = await newMessage.save();
          app.io.emit("message", { msg: messageResult });
        }
      });
    } else {
      let newConversation = {
        // _id: items._id,
        convoId: e.from,
        members: [e.from, e.to],
        creator: e.from,
      };
      const conversation = new ConversationData(newConversation);

      var result = await conversation.save();

      // let alreadyChat = await MessageData.find({
      //   convoId: e,
      // }).populate("conversations");

      let message = {
        conversationId: result._id,
        author: e.from,
        text: e.msg,
      };

      const newMessage = new MessageData(message);
      const messageResult = await newMessage.save();
      app.io.emit("message", { msg: messageResult });
    }

    // sahi ha

    // }
    // const convo = await ConversationData.find({creator:e.from})
    // console.log(e)
    // let sourceId = client.user_id;
    // console.log(client.user_id,clients)
    // cli.emit("message", e);
    // if(targetId && clients[targetId]) {
    //   clients[targetId].forEach(cli => {
    //     cli.emit("message", e);
    //   });
    // }

    // if(sourceId && clients[sourceId]) {
    //   clients[sourceId].forEach(cli => {
    //     cli.emit("message", e);
    //   });
    // }
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
