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

const updateComment = asyncHandler(async (req, res) => {
  const { newContent } = req.body;
  const { commentId } = req.params;

  if (!newContent || newContent?.trim() === "") {
    throw new ApiError(400, "content is required");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "This video id is not valid");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment not found!");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to update this comment!"
    );
  }

  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newContent,
      },
    },
    {
      new: true,
    }
  );

  if (!updateComment) {
    throw new ApiError(500, "something went wrong while updating comment");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, updateComment, "comment updated successfully!!")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "This video id is not valid");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment not found!");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to delete this comment!"
    );
  }

  const deleteComment = await Comment.deleteOne(req.user._id);

  if (!deleteComment) {
    throw new ApiError(500, "something went wrong while deleting comment");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, deleteComment, "comment deleted successfully!!")
    );
});

const addCommentToTweet = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { tweetId } = req.params;

  if (!comment || comment?.trim() === "") {
    throw new ApiError(400, "comment is required");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "This tweet id is not valid");
  }

  const tweetComment = await Comment.create({
    content: comment,
    tweet: tweetId,
    owner: req.user._id,
  });

  if (!tweetComment) {
    throw new ApiError(
      500,
      "something went wrong while creating tweet comment"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, tweetComment, "Tweet comment created successfully!!")
    );
});

const updateCommentToTweet = asyncHandler(async (req, res) => {
  const { newContent } = req.body;
  const { commentId } = req.params;

  if (!newContent || newContent?.trim() === "") {
    throw new ApiError(400, "content is required");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "This video id is not valid");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment not found!");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to update this comment!"
    );
  }

  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newContent,
      },
    },
    {
      new: true,
    }
  );

  if (!updateComment) {
    throw new ApiError(500, "something went wrong while updating comment");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, updateComment, "comment updated successfully!!")
    );
});

const deleteCommentToTweet = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "This tweet id is not valid");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment not found!");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to delete this comment!"
    );
  }

  const deleteComment = await Comment.deleteOne(req.user._id);

  if (!deleteComment) {
    throw new ApiError(500, "something went wrong while deleting comment");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, deleteComment, "comment deleted successfully!!")
    );
});
export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  addCommentToTweet,
  addCommentToTweet,
  updateCommentToTweet,
  deleteCommentToTweet,
};
