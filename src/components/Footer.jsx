import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export default function Footer() {
  return (
    <>
      <div className="HeaderComponent">
        <h1>Social Media App</h1>
        <div className="auth-buttons-container">
          <SignedOut>
            <SignInButton className="auth-button" />
            <SignUpButton className="auth-button" />
          </SignedOut>
          <SignedIn>
            <UserButton className="auth-button" />
          </SignedIn>
        </div>
      </div>
    </>
  );
}
