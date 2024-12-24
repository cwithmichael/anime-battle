"use client";

import { KeyIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <h1>Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label htmlFor="username">Username</label>
            <div>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon style={{ width: "18px", height: "18px" }} />
            </div>
          </div>
        </div>
        <button aria-disabled={isPending}>
          Log in <ArrowRightIcon style={{ width: "18px", height: "18px" }} />
        </button>
        <div aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <>
              <ExclamationCircleIcon
                style={{ width: "18px", height: "18px" }}
              />
              <p>{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
