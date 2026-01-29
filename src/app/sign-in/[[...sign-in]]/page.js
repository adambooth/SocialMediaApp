import { SignIn } from "@clerk/nextjs";
import "./signInPage.css";

export default function signInPage() {
  return (
    <>
      <div className="main-body">
        <SignIn path="/sign-in" routing="path" />
      </div>
    </>
  );
}
