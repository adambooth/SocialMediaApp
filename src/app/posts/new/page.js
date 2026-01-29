import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/.dbConnection";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/utils/requireProfile";
import "./createPostPage.css";

export default async function newPostPage() {
  await requireProfile();

  const { userId } = await auth();
  async function handleSubmit(formData) {
    "use server";

    const content = formData.get("content");

    await db.query(
      `INSERT INTO week9posts (clerk_user_id, content) VALUES ($1, $2)`,
      [userId, content],
    );

    revalidatePath("/posts");

    redirect("/posts");
  }

  return (
    <div className="main-form-container">
      <div className="form-header">
        <h2>Create A Post</h2>
      </div>
      <div className="form-wrapper">
        <form action={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              name="content"
              placeholder="Your content"
              required
              maxLength="50"
            />
          </div>

          <button type="submit" className="submit-buttonss">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
