import { db } from "@/utils/.dbConnection";
import Link from "next/link";
import "./allPosts.css";

export default async function allPostsPage() {
  const { rows } = await db.query(`SELECT * FROM week9posts`);

  const { rows: userRows } = await db.query(
    `SELECT clerk_user_id, username FROM week9users`,
  );

  const userMap = {};
  userRows.forEach((user) => {
    userMap[user.clerk_user_id] = user.username;
  });

  console.log(userMap);

  return (
    <>
      <div className="posts-container">
        <h1 className="all-posts-title">Posts Page</h1>
        <div className="all--posts-container">
          {rows.map((posts) => {
            const username = userMap[posts.clerk_user_id];
            return (
              <div key={posts.id} className="post-template">
                <div className="post-details-container">
                  <Link href={`/user/${username}`}>
                    <p className="post-creator">Creator: {username}</p>
                  </Link>
                  <p className="post-desc">Description: {posts.content}</p>
                </div>
                <div className="view-post-container">
                  <Link href={`/posts/${posts.id}`}>
                    <button className="view-post-btn">View Post</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="create-a-post-conatiner">
        <h1 className="all-posts-title">Create A Post!</h1>
        <ul>
          <li>Join the community and share your thoughts or ideas.</li>
          <li>
            Start discussions and connect with others who share your interests.
          </li>
          <li>Get feedback, tips, or advice from fellow members.</li>
          <li>Showcase your creativity and inspire someone today.</li>
          <li>
            Be part of something bigger – your post could spark amazing
            conversations!
          </li>
        </ul>
        <Link href={`/posts/new`}>
          <button className="create-a-post-btn">Create A Post</button>
        </Link>
      </div>
    </>
  );
}
