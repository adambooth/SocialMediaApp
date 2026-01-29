import { requireProfilePostMatch } from "@/utils/requireProfilePostMatch";
import { db } from "@/utils/.dbConnection";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import "./editPostPage.css";

export default async function editPostPage({ params }) {
  await requireProfilePostMatch({ params });
  const { id } = await params;

  return (
    <>
      <div className="edit-specifc-post-container">
        <div className="specific-form-wrapper">
          <h1>Edit Post</h1>

          <form
            className="specific-form"
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
            <textarea type="text" name="content" required />

            <button className="specific-submit-button" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
