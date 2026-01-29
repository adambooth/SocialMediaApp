import { db } from "@/utils/.dbConnection";
import Link from "next/link";

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
      <h1>All Posts Page</h1>
      <div className="posts-container ">
        <h1 className="mt-20">Posts Page</h1>
        {rows.map((posts) => {
          const username = userMap[posts.clerk_user_id];
          return (
            <div key={posts.id} className="post-template">
              <Link href={`/user/${username}`}>
                <p className="post-creator post-content">Creator: {username}</p>
              </Link>
              <p className="post-description post-content">
                Description: {posts.content}
              </p>
              <Link href={`/posts/${posts.id}`}>
                <button>View Post</button>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="create-a-post-conatiner">
        <Link href={`/posts/new`}>
          <button>Create A Post</button>
        </Link>
      </div>
    </>
  );
}
