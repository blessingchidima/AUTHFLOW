import { Request, Response } from "express";
import authorModel from "../model/authorModel";
import articleModel from "../model/articleModel";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";

export const createArticle = async (req: any, res: Response) => {
  try {
    const { email, description, content, title } = req.body;
    const { authorID } = req.params;

    // const author: any = await authorModel.findOne({ email });
    const author: any = await authorModel.findById(authorID);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path
    );

    const article = await articleModel.create({
      description,
      content,
      title,
      authorID: author._id,
      author,
      image: secure_url,
      imageID: public_id,
    });

    author?.articles.push(new mongoose.Types.ObjectId(article._id));

    author.save();

    res.status(201).json({
      message: "Article created",
      data: article,
    });
  } catch (error) {
    res.status(404).json({
      message: "Error Found",
      data: error.message,
    });
  }
};

export const getAuthorArticles = async (req: any, res: Response) => {
  try {
    const { authorID } = req.params;

    const author: any = await authorModel.findById(authorID).populate({
      path: "articles",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    res.status(201).json({
      message: "Article created",
      data: author,
    });
  } catch (error) {
    res.status(404).json({
      message: "Error Found",
      data: error.message,
    });
  }
};

export const likeAuthorArticle = async (
  req: Request,
  res: Response
) => {
  try {
    const { authorID, articleID } = req.params;
    const user: any  = await authorModel.findById(authorID);

    if (user) {
      const likeArticle: any = await articleModel.findById(articleID);

  
      if (!likeArticle) {
        return res.status(404).json({
          message : "Article not found",
        })
      }
      if (likeArticle.likes?.includes(user._id)) {
        return res.status(409).json({
          message: "You have liked this article already"
        })
      }
       likeArticle?.likes?.push(user._id);
      likeArticle?.save();



      return res.status(201).json({
        message: `post liked by ${user.name}`,
      });
    } else {
      return res.status(200).json({
        message: "you can't do this"
      })
    }
  } catch (error) {
    res.status(404).json({
      message: "Error Found",
      data: error.message,
    });
  }
};

export const unLikeAuthorArticle = async (
  req: Request,
  res: Response
) => {
  try {
    const { authorID, articleID } = req.params;
    const user = await authorModel.findById(authorID);

    if (user) {
      const likeArticle: any = await articleModel.findById(articleID);

      likeArticle?.likes?.pull(new mongoose.Types.ObjectId(user?._id));
      likeArticle?.save();

      return res.status(201).json({
        message: `post unliked by ${user.name}`,
        data: likeArticle,
      });
    } else {
      return res.status(200).json({
        message: "you can't do this"
      })
    }
  } catch (error) {
    res.status(404).json({
      message: "Error Found",
      data: error.message,
    });
  }
};