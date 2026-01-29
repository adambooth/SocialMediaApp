import { db } from "@/utils/.dbConnection";
import { auth } from "@clerk/nextjs/server";
import { requireProfile } from "@/utils/requireProfile";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import "./editProfile.css";

export default async function EditProfilePage() {
  await requireProfile();

  const { userId } = await auth();

  console.log(userId);

  return (
    <>
      <div className="edit-post-containers">
        <div className="form-wrappers">
          <h1>Edit Post</h1>

          <form
            className="form-containers"
            action={async (formData) => {
              "use server";

              const updatedNamed = formData.get("name");
              const updatedcontent = formData.get("content");

              const result = await db.query(
                `UPDATE week9users
               SET username = $1, bio = $2 
               WHERE clerk_user_id = $3`,
                [updatedNamed, updatedcontent, userId],
              );

              console.log("Rows updated:", result.rowCount);

              revalidatePath(`/profile`);
              redirect(`/profile`);
            }}
          >
            <label>Name :</label>
            <input
              type="text"
              name="name"
              required
              pattern="[A-Za-z]+"
              title="Username must contain only letters"
              placeholder="Letters Only No Spaces"
              className="edit-post-input"
            />

            <label>Content : </label>
            <textarea name="content" required maxLength="50" />

            <button className="submit-button" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
