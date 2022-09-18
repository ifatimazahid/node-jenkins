var _ = require("lodash");
const config = require("config");
const express = require("express");
const { Courses } = require("../../Models/course");
const Joi = require("joi");

const app = express();

app.get("/get", async (req, res) => {
  const course = await getAllCourses();
  var success = {
    success: true,
    msg: "Courses Found",
    data: course,
  };
  res.send(success);
});

async function getAllCourses() {
  const courses = await Courses.aggregate([
    {
      $lookup: {
        from: "sessions",
        localField: "courseId",
        foreignField: "courseId",
        as: 'sessions'
      },
    }
  ]);
  return courses;
}

// async function getAllCourses(body) {
//   const myPlace = await courses
//     .find()

//     var _Userid = mongoose.mongo.ObjectId(body.user._id);
//     console.log(_Userid,typeof(_Userid))
//   const palace = placeData.aggregate([
//     {

//       $lookup:{
//         from: "visitplaces",
//         // localField: "_id",
//         // foreignField: "_placeId",
//         let :  {
//           "placeId" : "$_id"
//       },
//         pipeline : [
//           { $sort: { visitingNo : -1 } },
//           {
//               $match : {
//                   $expr : {
//                       $and : [
//                         // {$eq: [ "$_placeId", "$$placeId" ]},
//                         // {"_userId": 0}
//                       ]
//                   }
//               }
//           },
//       ],

//         as: "places"
//       }
//     }
//   ])

//   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",palace)
//   return palace;
// }

module.exports = app;
