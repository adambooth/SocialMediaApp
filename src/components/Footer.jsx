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
      <div className="FooterComponent">
        <div className="footer-auth-buttons-container">
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
