import { db } from "@/utils/.dbConnection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireProfilePostMatch({ params }) {
  const { userId } = await auth();
  const { id } = await params;

  const { rows } = await db.query(`SELECT * FROM week9posts WHERE id = $1`, [
    id,
  ]);

  const postClerkId = rows[0].clerk_user_id;

  console.log("Post ID in server:", id);
  console.log("Post Clerk Id in server:", postClerkId);
  console.log("User ID in server:", userId);

  if (postClerkId !== userId) {
    redirect("/posts");
  }
}
