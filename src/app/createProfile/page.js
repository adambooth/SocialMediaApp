import { db } from "@/utils/.dbConnection";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export default async function CreateProfilePage() {
  const { userId } = await auth();

  const doesUserExitsInDatabase = await db.query(
    `SELECT id FROM week9users WHERE clerk_user_id = $1`,
    [userId],
  );

  if (doesUserExitsInDatabase.rows.length > 0) {
    redirect("/posts");
  }

  async function handleSubmit(formData) {
    "use server";

    const username = formData.get("username");
    const bio = formData.get("bio");

    await db.query(
      `INSERT INTO week9users (clerk_user_id, username, bio) VALUES ($1, $2, $3)`,
      [userId, username, bio],
    );

    revalidatePath("/profile");

    redirect("/profile");
  }

  return (
    <div className="main-form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2>Create Your Profile</h2>
        </div>

        <form action={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              placeholder="Your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
