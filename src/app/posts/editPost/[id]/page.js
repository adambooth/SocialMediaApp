import { requireProfilePostMatch } from "@/utils/requireProfilePostMatch";

export default async function editPostPage({ params }) {
  await requireProfilePostMatch({ params });

  const { id } = await params;
  console.log("Post ID in page:", id);

  return (
    <>
      <h1>Edit Post Page</h1>
      <p>Editing post {id}</p>
    </>
  );
}
