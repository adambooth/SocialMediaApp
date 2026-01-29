import { db } from "@/utils/.dbConnection";
import { auth } from "@clerk/nextjs/server";
import "./profile.css";

export default async function profilePage() {
  const { userId } = await auth();

  const { rows } = await db.query(
    `SELECT * FROM week9users WHERE clerk_user_id = $1`,
    [userId],
  );

  const post = rows[0];

  console.log(post);

  return (
    <>
      <div className="profile-container">
        <h1 className="profile-title">Profile Page</h1>
        <p className="profile-name">Name : {post.username}</p>
        <p className="profile-bio">Bio : {post.bio}</p>
        <button className="edit-profile-btn">Edit Profile</button>
      </div>
    </>
  );
}
