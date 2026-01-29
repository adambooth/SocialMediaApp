import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="HeaderComponent">
        <Link href={"/posts"}>
          <h1>Social Media App</h1>
        </Link>
        <div className="auth-buttons-container">
          <SignedOut>
            <SignInButton className="auth-button" />
            <SignUpButton className="auth-button" />
          </SignedOut>
          <SignedIn>
            <Link href={"/profile"}>
              <button>Profile</button>
            </Link>
            <UserButton className="auth-button" />
          </SignedIn>
        </div>
      </div>
    </>
  );
}
