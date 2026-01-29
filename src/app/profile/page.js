import { db } from "@/utils/.dbConnection";
import { auth } from "@clerk/nextjs/server";

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
      <h1>Profile Page</h1>
      <p>Name : {post.username}</p>
      <p>Bio : {post.bio}</p>
    </>
  );
}
