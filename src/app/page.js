import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function App() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="profile-page">
        <h1>Create An Account To Access Everything!</h1>
        <SignInButton className="auth-button" />
        <SignUpButton className="auth-button" />
      </div>
    );
  }

  redirect("/profile");
}
