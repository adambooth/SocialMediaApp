import { requireProfilePostMatch } from "@/utils/requireProfilePostMatch";
import { db } from "@/utils/.dbConnection";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function editPostPage({ params }) {
  await requireProfilePostMatch({ params });
  const { id } = await params;

  return (
    <>
      <div classcontent="edit-post-container">
        <div classcontent="form-wrapper">
          <h1>Edit Post</h1>

          <form
            action={async (formData) => {
              "use server";

              const updatedcontent = formData.get("content");

              await db.query(
                `UPDATE week9posts 
               SET content = $1 WHERE id = $2`,
                [updatedcontent, id],
              );

              revalidatePath(`/posts`);
              redirect(`/posts`);
            }}
          >
            <label>Content :</label>
            <input type="text" name="content" required />

            <button className="submit-button" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
