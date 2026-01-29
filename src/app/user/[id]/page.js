import { db } from "@/utils/.dbConnection";
import { notFound } from "next/navigation";
import "./userIdPage.css";
import Link from "next/link";
import { requireProfile } from "@/utils/requireProfile";

export default async function UserPage({ params }) {
  await requireProfile();

  const { id: userId } = await params;

  const { rows: users } = await db.query(
    "SELECT clerk_user_id FROM week9users WHERE username = $1",
    [userId],
  );

  const { rows: bio } = await db.query(
    "SELECT bio FROM week9users WHERE username = $1",
    [userId],
  );

  if (users.length === 0) {
    notFound();
  }

  const { rows: posts } = await db.query(
    "SELECT * FROM week9posts WHERE clerk_user_id = $1",
    [users[0].clerk_user_id],
  );

  return (
    <div className="specific-user-container">
      <h1 className="specific-user-profile-name">{userId}'s Profile</h1>
      <div className="specific-user-details">
        <h1>Bio : {bio[0].bio}</h1>
      </div>
      <h2 className="specific-user-profile-name">Posts</h2>
      <div className="specific-user-posts">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="specific-user-post">
              <div>
                <p>{post.content}</p>
              </div>
              <div className="view-post-container">
                <Link href={`/posts/${post.id}`}>
                  <button className="view-post-btn">View Post</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
