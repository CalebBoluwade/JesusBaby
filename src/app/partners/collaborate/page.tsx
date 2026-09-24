import Link from "next/link";
import { ArrowLeft, Handshake, Mail } from "lucide-react";

export default function CollaboratePage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-12 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/partners" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600"><ArrowLeft className="h-4 w-4" /> Back to Partners</Link>
        <div className="mt-12 border border-slate-900/10 bg-white p-8 shadow-[8px_8px_0_#e7dfcf] sm:p-12">
          <Handshake className="h-10 w-10 text-indigo-600" />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-indigo-600">Collaboration</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Collaborate with Us</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Bring your gifts, ideas, and networks alongside JesusBaby as we create spaces for deliverance, discipleship, and hope.</p>
          <p className="mt-4 leading-8 text-slate-600">Tell us about your organization, project, or ministry focus. We would love to explore a thoughtful way to work together.</p>
          <a href="mailto:partners@jesusbaby.com?subject=Collaborate%20with%20JesusBaby" className="mt-8 inline-flex items-center gap-2 bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"><Mail className="h-4 w-4" /> Start a conversation</a>
        </div>
      </div>
    </main>
  );
}