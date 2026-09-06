"use client";

import { FormEvent, useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Card, Section } from "@/components/ui";

const contactEmail = "info@peakstudyhub.com";

function sendMail(subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields)
    .map(([label, value]) => `${label}: ${value.trim()}`)
    .join("\n\n");
  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ContactPage() {
  const [platformForm, setPlatformForm] = useState({ name: "", contact: "", message: "" });
  const [contentForm, setContentForm] = useState({ name: "", contact: "", request: "", explanation: "" });

  function submitPlatform(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMail("Peak Study Hub platform enquiry", {
      Name: platformForm.name,
      "Contact detail": platformForm.contact,
      Message: platformForm.message
    });
  }

  function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMail("Peak Study Hub content request", {
      Name: contentForm.name,
      "Contact detail": contentForm.contact,
      "Topic/module/request": contentForm.request,
      "Short explanation": contentForm.explanation
    });
  }

  return (
    <Section>
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Reach Us</p>
      <h1 className="mt-3 text-4xl font-bold">Contact Peak Study Hub</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Use this page as the contact point for platform questions, subject requests, and future school or teacher enquiries.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card>
          <Mail className="text-ocean" size={24} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">Email</h2>
          <p className="mt-2 leading-6 text-slate-600">{contactEmail}</p>
        </Card>

        <Card>
          <MessageSquare className="text-ocean" size={24} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">Platform enquiries</h2>
          <form onSubmit={submitPlatform} className="mt-4 grid gap-3">
            <input required value={platformForm.name} onChange={(event) => setPlatformForm((form) => ({ ...form, name: event.target.value }))} className="rounded-lg border border-line px-3 py-2" placeholder="Name" />
            <input required value={platformForm.contact} onChange={(event) => setPlatformForm((form) => ({ ...form, contact: event.target.value }))} className="rounded-lg border border-line px-3 py-2" placeholder="Contact detail/email" />
            <textarea required value={platformForm.message} onChange={(event) => setPlatformForm((form) => ({ ...form, message: event.target.value }))} className="min-h-28 rounded-lg border border-line px-3 py-2" placeholder="Enquiry/message" />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-ocean px-4 py-2 font-semibold text-white hover:bg-ocean/90">
              <Send size={16} aria-hidden="true" /> Send enquiry
            </button>
          </form>
        </Card>

        <Card>
          <Send className="text-ocean" size={24} aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">Content requests</h2>
          <form onSubmit={submitContent} className="mt-4 grid gap-3">
            <input required value={contentForm.name} onChange={(event) => setContentForm((form) => ({ ...form, name: event.target.value }))} className="rounded-lg border border-line px-3 py-2" placeholder="Name" />
            <input required value={contentForm.contact} onChange={(event) => setContentForm((form) => ({ ...form, contact: event.target.value }))} className="rounded-lg border border-line px-3 py-2" placeholder="Contact detail/email" />
            <input required value={contentForm.request} onChange={(event) => setContentForm((form) => ({ ...form, request: event.target.value }))} className="rounded-lg border border-line px-3 py-2" placeholder="Topic/module/request" />
            <textarea required value={contentForm.explanation} onChange={(event) => setContentForm((form) => ({ ...form, explanation: event.target.value }))} className="min-h-24 rounded-lg border border-line px-3 py-2" placeholder="Short explanation" />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-ocean px-4 py-2 font-semibold text-white hover:bg-ocean/90">
              <Send size={16} aria-hidden="true" /> Send request
            </button>
          </form>
        </Card>
      </div>
    </Section>
  );
}
