import { db } from "@/utils/.dbConnection";
import { notFound } from "next/navigation";

export default async function UserPage({ params }) {
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
    <div>
      <h1>{userId}'s Profile</h1>
      <h1>Bio : {bio[0].bio}</h1>
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id}>
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
