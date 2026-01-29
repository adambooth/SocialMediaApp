import { db } from "@/utils/.dbConnection";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import "./createProfile.css";

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
    <div className="main-form-containers">
      <div className="form-wrappers">
        <div className="form-headers">
          <h2>Create Your Profile</h2>
        </div>
        <div className="form-containers">
          <form action={handleSubmit} className="form-contents">
            <div className="form-groups">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                name="username"
                placeholder="Your username"
                required
              />
            </div>

            <div className="form-groups">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself"
                required
              />
            </div>

            <button type="submit" className="submit-buttons">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
