import { db } from "@/utils/.dbConnection";
import "./postId.css";
import { requireProfile } from "@/utils/requireProfile";

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

  console.log(post);
  console.log(user);

  return (
    <>
      <div className="specific-post-container">
        <h1 className="specific-post-title">Post Details</h1>
        <div className="main-post-container">
          <div className="post-details-container">
            {" "}
            <div className="specific-post-content">
              <h1>Name : {user.username}</h1>
              <h1 className="post-desc">Description : {post.content}</h1>
              <div className="specific-comments-container"></div>
            </div>
          </div>
        </div>
        <div className="comments-conatiner">
          <div className="comment-template">
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
          </div>
          <div className="comment-template">
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
          </div>
          <div className="comment-template">
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
          </div>
          <div className="comment-template">
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
            <p>Comment</p>
          </div>
        </div>
      </div>
    </>
  );
}
