import { db } from "@/utils/.dbConnection";
import "./postId.css";
import { requireProfile } from "@/utils/requireProfile";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function specificPostPage({ params }) {
  await requireProfile();

  const { id } = await params;

  const { rows } = await db.query(`SELECT * FROM week9posts WHERE id = $1`, [
    id,
  ]);

  const post = rows[0];

  const userResult = await db.query(
    `SELECT username FROM week9users WHERE clerk_user_id = $1`,
    [post.clerk_user_id],
  );

  const user = userResult.rows[0];

  const { userId } = await auth();

  const { rows: likes } = await db.query(
    "SELECT * FROM week9likes WHERE post_id = $1",
    [post.id],
  );

  const { rows: comments } = await db.query(
    `SELECT * FROM week9comments WHERE post_id = $1`,
    [id],
  );

  const { rows: username } = await db.query(
    `SELECT username FROM week9users WHERE clerk_user_id = $1`,
    [userId],
  );

  async function handleSubmitComment(formData) {
    "use server";

    const content = formData.get("content");

    await db.query(
      `INSERT INTO week9comments (post_id, clerk_user_id, content, username) VALUES ($1, $2, $3, $4)`,
      [id, userId, content, username[0].username],
    );

    revalidatePath(`/posts/${post.id}`);

    redirect(`/posts/${post.id}`);
  }

  async function handleDelete() {
    "use server";

    await db.query(`DELETE FROM week9posts WHERE id = $1`, [id]);

    revalidatePath(`/posts`);
    redirect("/posts");
  }

  const { rows: existingLike } = await db.query(
    "SELECT * FROM week9likes WHERE clerk_user_id = $1 AND post_id = $2",
    [userId, post.id],
  );

  const handleLike = async () => {
    "use server";

    if (existingLike.length > 0) {
      return;
    }

    await db.query(
      `INSERT INTO week9likes (clerk_user_id, post_id) VALUES ($1, $2)`,
      [userId, post.id],
    );

    await db.query(
      `UPDATE week9likes 
   SET like_amount = like_amount + 1 
   WHERE clerk_user_id = $1 AND post_id = $2 
   RETURNING *`,
      [userId, post.id],
    );

    revalidatePath(`/posts/${post.id}`);
    redirect(`/posts/${post.id}`);
  };

  const alreadyLikesPost = existingLike.length > 0;

  async function handleUnLike() {
    "use server";

    if (existingLike.length === 0) {
      return;
    }

    await db.query(
      `DELETE FROM week9likes WHERE clerk_user_id = $1 AND post_id = $2`,
      [userId, post.id],
    );

    await db.query(
      `UPDATE week9likes SET like_amount = like_amount - 1 WHERE clerk_user_id = $1 AND post_id = $2 RETURNING *`,
      [userId, post.id],
    );

    revalidatePath(`/posts/${post.id}`);
  }

  return (
    <>
      <div className="specific-post-container">
        <h1 className="specific-post-title">Post Details</h1>
        <div className="main-post-container">
          {alreadyLikesPost ? (
            <button className="like-btn" onClick={handleUnLike}>
              <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios/50/thumbs-down.png"
                alt="thumbs-down"
              />
            </button>
          ) : (
            <button className="like-btn" onClick={handleLike}>
              <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios/50/facebook-like--v1.png"
                alt="facebook-like--v1"
              />
            </button>
          )}
          <div className="post-details-container">
            {" "}
            <div className="specific-post-content">
              <h1>Name : {user.username}</h1>
              <h1 className="post-desc">Description : {post.content}</h1>
              <h1 className="post-desc">Likes : {likes.length}</h1>
              {post.clerk_user_id === userId ? (
                <div className="post-edit-delete-btn-conatiner">
                  <Link href={`/posts/editPost/${post.id}`}>
                    <button className="edit-post-button">Edit Post</button>
                  </Link>
                  <button onClick={handleDelete} className="edit-post-button">
                    Delete Post
                  </button>
                </div>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
        <div className="comments-conatiner">
          <h1>Comments</h1>
          {comments.map((comment) => {
            return (
              <div key={comment.comment_id} className="comment-template">
                <h2>Username : {comment.username}</h2>
                <p>Comment : {comment.content}</p>
              </div>
            );
          })}
        </div>
        <form action={handleSubmitComment} className="comments-form-contents">
          <div className="comments-form-groups">
            <label htmlFor="comments-content">Content:</label>
            <textarea
              id="content"
              name="content"
              placeholder="Tell us about yourself"
              required
              maxLength="50"
            />
          </div>

          <button type="submit" className="comments-submit-buttons">
            Submit Comment
          </button>
        </form>
      </div>
    </>
  );
}
