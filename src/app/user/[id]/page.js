import { db } from "@/utils/.dbConnection";
import { notFound } from "next/navigation";

export default async function UserPage({ params }) {
  const { id: userId } = await params;

  const { rows: users } = await db.query(
    "SELECT * FROM week9users WHERE id = $1",
    [userId],
  );

  if (users.length === 0) {
    notFound();
  }

  const user = users[0];

  const { rows: posts } = await db.query(
    "SELECT * FROM week9posts WHERE user_id = $1",
    [userId],
  );

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
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
