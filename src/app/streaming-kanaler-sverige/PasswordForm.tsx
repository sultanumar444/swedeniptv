"use client";

import { useActionState } from "react";
import { unlockKanaler } from "./actions";

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(unlockKanaler, { error: "" });

  return (
    <div className="kanaler-lock">
      <div className="kanaler-lock__icon" aria-hidden="true">
        <svg viewBox="0 0 448 512" width="26" height="26" fill="currentColor">
          <path d="M144 144v48h160v-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zm-64 48v-48C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64v192c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z" />
        </svg>
      </div>
      <h2 className="kanaler-lock__title">Kanallistan är lösenordsskyddad</h2>
      <p className="kanaler-lock__text">Ange lösenordet för att se alla kanaler.</p>
      <form action={formAction} className="kanaler-lock__form">
        <label htmlFor="kanaler-password" className="elementor-screen-only">
          Lösenord
        </label>
        <input
          id="kanaler-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Lösenord"
          className="kanaler-lock__input"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "kanaler-password-error" : undefined}
        />
        <button type="submit" className="kanaler-lock__button" disabled={pending}>
          {pending ? "Kontrollerar…" : "Visa kanaler"}
        </button>
      </form>
      {state.error && (
        <p id="kanaler-password-error" className="kanaler-lock__error" role="alert">
          {state.error}
        </p>
      )}
    </div>
  );
}
