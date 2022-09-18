const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseSubject: {
    type: String,
    required: true
  },
  facultyName: {
    type: String,
    required: true
  },
  liveSession: {
    type: Boolean,
    required: true
  },
  isPaid: {
    type: Boolean,
    required: true
  },
  shortDescription: {
    type: String
  },
  numberOfSessions: {
    type: Number
  },
  createdDate: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  sessionDate: {
    type: String,
    required: true
  },
  sessionTime: {
    type: String,
    required: true
  },
  createdDate: { type: Date, default: Date.now },
});

const Sessions = mongoose.model("sessions", sessionSchema);
const Courses = mongoose.model("courses", courseSchema);

exports.Sessions = Sessions;
exports.Courses = Courses;
