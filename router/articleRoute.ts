import express from "express";
import {
  createArticle,
  getAuthorArticles,
  likeAuthorArticle,
  unLikeAuthorArticle,
} from "../controller/articleController";
import upload from "../config/multer";

const router = express.Router();

router.route("/:authorID/create-article").post(upload, createArticle);
router.route("/:authorID/read-article").get(getAuthorArticles);
router.route("/:userID/:postID/unlike-post").post(unLikeAuthorArticle);

router.route("/:userID/:postID/like-post").post(likeAuthorArticle);
export default router;
