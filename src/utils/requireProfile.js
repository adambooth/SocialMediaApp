import { db } from "@/utils/.dbConnection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireProfile() {
  const { userId } = await auth();

  const result = await db.query(
    `SELECT bio FROM week9users WHERE clerk_user_id = $1`,
    [userId],
  );

  const userRows = result.rows;

  if (userRows.length === 0 || !userRows[0].bio) {
    redirect("/createProfile");
  }

  return userRows[0];
}
