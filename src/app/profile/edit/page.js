import { db } from "@/utils/.dbConnection";
import { auth } from "@clerk/nextjs/server";
import { requireProfile } from "@/utils/requireProfile";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
  await requireProfile();

  const { userId } = await auth();

  console.log(userId);

  return (
    <>
      <div className="edit-post-container">
        <div className="form-wrapper">
          <h1>Edit Post</h1>

          <form
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
            <input type="text" name="name" required />

            <label>content : </label>
            <textarea name="content" required />

            <button className="submit-button" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
