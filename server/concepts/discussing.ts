import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  rootId: ObjectId; // Represents the "root" entity (post, media, etc.)
  content: string;
}

/**
 * Concept: Discussing
 */
export default class DiscussingConcept {
  public readonly discussions: DocCollection<CommentDoc>;

  constructor(collectionName: string) {
    this.discussions = new DocCollection<CommentDoc>(collectionName);
  }

  async addComment(author: ObjectId, rootId: ObjectId, content: string) {
    const _id = await this.discussions.createOne({ author, rootId, content });
    return { msg: "Comment added successfully!", comment: await this.discussions.readOne({ _id }) };
  }

  async getCommentsForRoot(rootId: ObjectId) {
    const comments = await this.discussions.readMany({ rootId });
    return comments;
  }

  async getCommentsByUser(userId: ObjectId) {
    const comments = await this.discussions.readMany({ authorId: userId });
    return comments;
  }

  async getComment(_id: ObjectId) {
    return await this.discussions.readOne({ _id });
  }

  async deleteComment(_id: ObjectId) {
    await this.discussions.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }

  async update(_id: ObjectId, content?: string) {
    await this.discussions.partialUpdateOne({ _id }, { content });
    return { msg: "Post successfully updated!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const comment = await this.discussions.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    if (comment.author.toString() !== user.toString()) {
      throw new NotAllowedError("User is not author");
    }
  }

  async assertCommentExists(_id: ObjectId) {
    if (!(await this.discussions.readOne({ _id }))) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
  }

  private redactComment(comment: CommentDoc): Omit<CommentDoc, "content"> & { content: string } {
    return { ...comment, content: "[REDACTED]" };
  }
}
