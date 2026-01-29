import { db } from "@/utils/.dbConnection";
import { notFound } from "next/navigation";
import "./userIdPage.css";
import Link from "next/link";
import { requireProfile } from "@/utils/requireProfile";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function UserPage({ params }) {
  await requireProfile();
  const { userId } = await auth();

  const { id: profileId } = await params;

  const { rows: users } = await db.query(
    "SELECT clerk_user_id FROM week9users WHERE username = $1",
    [profileId],
  );

  const { rows: bio } = await db.query(
    "SELECT bio FROM week9users WHERE username = $1",
    [profileId],
  );

  if (users.length === 0) {
    notFound();
  }

  const { rows: posts } = await db.query(
    "SELECT * FROM week9posts WHERE clerk_user_id = $1",
    [users[0].clerk_user_id],
  );

  const { rows: profileUser } = await db.query(
    "SELECT * FROM week9users WHERE username = $1",
    [profileId],
  );

  const { rows: existingFollow } = await db.query(
    "SELECT * FROM week9followers WHERE follower_id = $1 AND following_id = $2",
    [userId, profileUser[0].clerk_user_id],
  );

  async function handleFollow() {
    "use server";

    if (existingFollow.length > 0) {
      console.log("Already following this user!");
      return;
    }

    await db.query(
      `INSERT INTO week9followers (follower_id, following_id) VALUES ($1, $2)`,
      [userId, profileUser[0].clerk_user_id],
    );

    console.log("Followed");
    revalidatePath(`/user/${profileId}`);
  }

  const isOwnProfile = userId === profileUser[0].clerk_user_id;
  const alreadyFollowing = existingFollow.length > 0;

  async function handleUnfollow() {
    "use server";

    if (existingFollow.length === 0) {
      console.log("You are not following this user!");
      return;
    }

    await db.query(
      `DELETE FROM week9followers WHERE follower_id = $1 AND following_id = $2`,
      [userId, profileUser[0].clerk_user_id],
    );

    console.log("Unfollowed");
    revalidatePath(`/user/${profileId}`);
  }

  return (
    <div className="specific-user-container">
      <h1 className="specific-user-profile-name">{profileId}'s Profile</h1>
      <div className="specific-user-details">
        <h1>Bio : {bio[0].bio}</h1>
        {isOwnProfile ? (
          <br />
        ) : alreadyFollowing ? (
          <button onClick={handleUnfollow}>UnFollow</button>
        ) : (
          <button onClick={handleFollow}>Follow</button>
        )}
      </div>
      <h2 className="specific-user-profile-name">Posts</h2>
      <div className="specific-user-posts">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="specific-user-post">
              <div>
                <p>{post.content}</p>
              </div>
              <div className="view-post-container">
                <Link href={`/posts/${post.id}`}>
                  <button className="view-post-btn">View Post</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
