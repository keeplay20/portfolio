import React, { useState } from "react";
import "./ContactForm.css";

type Status = "idle" | "sending" | "sent" | "error";

const FALLBACK_ERROR = "Something went wrong. Please try again.";

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || FALLBACK_ERROR);
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : FALLBACK_ERROR);
      setStatus("error");
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        className="contact-form__input"
        type="email"
        name="email"
        placeholder="Email"
        aria-label="Email"
        autoComplete="email"
        maxLength={254}
        required
      />
      <input
        className="contact-form__input"
        type="tel"
        name="phone"
        placeholder="Phone number"
        aria-label="Phone number"
        autoComplete="tel"
        minLength={7}
        maxLength={20}
        required
      />
      <textarea
        className="contact-form__input contact-form__message"
        name="message"
        placeholder="Message"
        aria-label="Message"
        rows={4}
        maxLength={5000}
        required
      />
      <input
        className="contact-form__trap"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <button
        type="submit"
        className="btn btn-primary contact-form__submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
      <p
        className={`contact-form__status contact-form__status--${status}`}
        aria-live="polite"
      >
        {status === "sent" && "Thanks! I'll get back to you soon."}
        {status === "error" && error}
      </p>
    </form>
  );
};

export default ContactForm;
