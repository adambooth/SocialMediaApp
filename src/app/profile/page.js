import { db } from "@/utils/.dbConnection";
import { auth } from "@clerk/nextjs/server";
import "./profile.css";
import { requireProfile } from "@/utils/requireProfile";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function profilePage() {
  await requireProfile();

  const { userId } = await auth();

  const { rows } = await db.query(
    `SELECT * FROM week9users WHERE clerk_user_id = $1`,
    [userId],
  );

  const post = rows[0];

  console.log(post);

  const { rows: posts } = await db.query(
    `SELECT * FROM week9posts WHERE clerk_user_id = $1`,
    [post.clerk_user_id],
  );

  if (!posts || posts.length === 0) {
    redirect("/not-found");
  }

  const { rows: userRows } = await db.query(
    `SELECT clerk_user_id, username FROM week9users`,
  );

  const userMap = {};
  userRows.forEach((user) => {
    userMap[user.clerk_user_id] = user.username;
  });

  return (
    <>
      <div className="profile-container">
        <h1 className="profile-title">Profile Page</h1>
        <p className="profile-name">Name : {post.username}</p>
        <p className="profile-bio">Bio : {post.bio}</p>
        <Link href={`/profile/edit`}>
          <button className="edit-profile-btn">Edit Profile</button>
        </Link>
      </div>
      <div className="posts-container">
        <h1 className="all-posts-title">Posts Page</h1>
        <div className="all--posts-container">
          {posts.map((post) => {
            const username = userMap[post.clerk_user_id] || "Unknown";
            return (
              <div key={post.id} className="post-template">
                <div className="post-details-container">
                  <Link href={`/user/${username}`}>
                    <p className="post-creator">Creator: {username}</p>
                  </Link>
                  <p className="post-desc">Description: {post.content}</p>
                </div>
                <div className="view-post-container">
                  <Link href={`/posts/${post.id}`}>
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
