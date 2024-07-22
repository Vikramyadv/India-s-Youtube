import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "This video id is not valid");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found");
  }
  const aggregateComments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
  ]);

  Comment.aggregatePaginate(aggregateComments, {
    page,
    limit,
  })
    .then((result) => {
      return res
        .status(201)
        .json(
          new ApiResponse(200, result, "VideoComments fetched  successfully!!")
        );
    })
    .catch((error) => {
      throw new ApiError(
        500,
        "something went wrong while fetching video Comments",
        error
      );
    });
});

const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { videoId } = req.params;

  console.log("req body ", req.body);
  console.log("comment", comment);

  if (!comment || comment?.trim() === "") {
    throw new ApiError(400, "comment is required");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "This video id is not valid");
  }

  const videoComment = await Comment.create({
    content: comment,
    video: videoId,
    owner: req.user._id,
  });

  if (!videoComment) {
    throw new ApiError(
      500,
      "something went wrong while creating video comment"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, videoComment, "video comment created successfully!!")
    );
});

const updateComment = asyncHandler(async (req, res) => {});

const deleteComment = asyncHandler(async (req, res) => {});

export { getVideoComments, addComment, updateComment, deleteComment };
