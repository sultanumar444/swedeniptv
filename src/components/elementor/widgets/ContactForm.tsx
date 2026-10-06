"use client";

import { useState, type FormEvent } from "react";
import { contactEmail } from "@/lib/site";
import type { FormNode } from "@/lib/wp/types";

/**
 * Elementor Pro form. WordPress handled submissions server-side; here the
 * message opens in the visitor's mail app, addressed to `contactEmail`.
 */
export default function ContactForm({ fields, button }: { fields: FormNode["fields"]; button: string }) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (n: string) => String(data.get(n) ?? "");
    const name = get("form_fields[name]");
    const body = fields
      .filter((f) => f.tag !== "button")
      .map((f) => `${f.label}: ${get(f.name)}`)
      .join("\n");
    const subject = `Kontakt från swedeniptv.net${name ? ` – ${name}` : ""}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className="elementor-form" name="Kontakt" aria-label="Kontaktformulär" onSubmit={onSubmit}>
      <div className="elementor-form-fields-wrapper elementor-labels-">
        {fields.map((f) => {
          const id = `form-field-${f.name.replace(/^form_fields\[|\]$/g, "")}`;
          return (
            <div key={f.name} className={["elementor-field-group elementor-column", ...f.cls, f.required && "elementor-field-required"].filter(Boolean).join(" ")}>
              <label className="elementor-field-label elementor-screen-only" htmlFor={id}>
                {f.label}
              </label>
              {f.tag === "textarea" ? (
                <textarea id={id} name={f.name} placeholder={f.placeholder} rows={Number(f.rows) || 4} required={f.required} className="elementor-field-textual elementor-field elementor-size-sm" />
              ) : (
                <input id={id} name={f.name} type={f.type} placeholder={f.placeholder} required={f.required} size={1} className="elementor-field elementor-size-sm elementor-field-textual" />
              )}
            </div>
          );
        })}
        <div className="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100 e-form__buttons">
          <button className="elementor-button elementor-size-sm" type="submit">
            <span className="elementor-button-content-wrapper">
              <span className="elementor-button-text">{button}</span>
            </span>
          </button>
        </div>
      </div>
      {sent && (
        <div className="elementor-message elementor-message-success" role="alert">
          Tack! Ditt e-postprogram öppnas med meddelandet. Du kan också mejla oss direkt på {contactEmail}.
        </div>
      )}
    </form>
  );
}
