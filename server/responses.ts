import { Authing } from "./app";
import { AlreadyFriendsError, FriendNotFoundError, FriendRequestAlreadyExistsError, FollowRequestDoc, FriendRequestNotFoundError, FollowerDoc } from "./concepts/following";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/posting";
import { Router } from "./framework/router";
import { CommentDoc } from "./concepts/discussing";
/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await Authing.getUserById(post.author);
    return { ...post, author: author.username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await Authing.idsToUsernames(posts.map((post) => post.author));
    return posts.map((post, i) => ({ ...post, author: authors[i] }));
  }

  /**
   * Convert CommentDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async comment(comment: CommentDoc | null) {
    if (!comment) {
      return comment;
    }
    const author = await Authing.getUserById(comment.author);
    return { ...comment, author: author.username };
  }

  /**
   * Same as {@link comment} but for an array of CommentDoc for improved performance.
   */
  static async comments(comments: CommentDoc[]) {
    const authors = await Authing.idsToUsernames(comments.map((comment) => comment.author));
    return comments.map((comment, i) => ({ ...comment, author: authors[i] }));
  }

  /**
   * Convert FriendRequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async friendRequests(requests: FollowRequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await Authing.idsToUsernames(from.concat(to));
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length] }));
  }

  static async follow(follows: FollowerDoc[]) {
    const followers = follows.map((follow) => follow.follower);
    const followeds = follows.map((follow) => follow.followed);
    const usernames = await Authing.idsToUsernames(followers.concat(followeds));
    return follows.map((follow, i) => ({ ...follow, follower: usernames[i], followed: usernames[i + follows.length] }));
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await Authing.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(FriendRequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.from), Authing.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.user1), Authing.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendRequestNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.from), Authing.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(AlreadyFriendsError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.user1), Authing.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});
