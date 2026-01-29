import { db } from "@/utils/.dbConnection";
import { notFound } from "next/navigation";

export default async function UserPage({ params }) {
  const { id: userId } = await params;

  console.log(userId);

  const { rows: users } = await db.query(
    "SELECT clerk_user_id FROM week9users WHERE username = $1",
    [userId],
  );

  console.log(users[0].clerk_user_id);

  if (users.length === 0) {
    notFound();
  }

  const user = users[0];

  const { rows: posts } = await db.query(
    "SELECT * FROM week9posts WHERE clerk_user_id = $1",
    [users[0].clerk_user_id],
  );

  console.log(posts);

  return (
    <div>
      <h1>{userId}'s Profile</h1>
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
