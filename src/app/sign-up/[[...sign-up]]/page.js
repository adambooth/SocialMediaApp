import { SignUp } from "@clerk/nextjs";

export default function signUpPage() {
  return (
    <>
      <div className="main-body">
        <SignUp path="/sign-up" routing="path" />
      </div>
    </>
  );
}
