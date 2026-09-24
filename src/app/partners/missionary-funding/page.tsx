import Link from "next/link";
import { ArrowLeft, Heart, Map, Send, Users } from "lucide-react";

export default function MissionaryFundingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_80%_0%,rgba(224,231,255,0.85),transparent_32%),#f7f5ef] px-5 py-12 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/partners" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> Back to Partners
        </Link>
        <section className="mt-10 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-700">JesusBaby Missions</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Funding <span className="text-indigo-600">Missionaries.</span></h1>
          <p className="mt-6 text-xl leading-9 text-slate-600">
            Missionaries serve people where hope is needed most. This project helps provide practical support for outreach, travel, training, and the everyday work of serving faithfully.
          </p>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          <div className="border border-slate-900/10 bg-white p-6 shadow-[6px_6px_0_#e7dfcf]"><Map className="h-7 w-7 text-indigo-600" /><h2 className="mt-5 text-xl font-bold">Reach communities</h2><p className="mt-2 leading-7 text-slate-600">Help missionaries travel and bring encouragement, prayer, and practical care to new communities.</p></div>
          <div className="border border-slate-900/10 bg-white p-6 shadow-[6px_6px_0_#e7dfcf]"><Users className="h-7 w-7 text-indigo-600" /><h2 className="mt-5 text-xl font-bold">Equip servants</h2><p className="mt-2 leading-7 text-slate-600">Support training, materials, and tools that make long-term ministry more sustainable.</p></div>
          <div className="border border-slate-900/10 bg-white p-6 shadow-[6px_6px_0_#e7dfcf]"><Heart className="h-7 w-7 text-indigo-600" /><h2 className="mt-5 text-xl font-bold">Care for people</h2><p className="mt-2 leading-7 text-slate-600">Help provide the personal and pastoral care missionaries need as they serve others.</p></div>
        </section>

        <section className="mt-14 bg-slate-900 p-8 text-white sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Partner with the mission</p>
          <h2 className="mt-3 text-3xl font-black">Help send hope further.</h2>
          <p className="mt-4 max-w-2xl leading-8 text-slate-300">We are building the funding structure for this project with trusted ministry partners. Contact us to discuss recurring support, one-time gifts, or sponsoring a specific missionary initiative.</p>
          <a href="mailto:partners@jesusbaby.com?subject=Funding%20Missionaries" className="mt-8 inline-flex items-center gap-2 bg-amber-500 px-5 py-3 font-bold text-slate-950 hover:bg-amber-400"><Send className="h-4 w-4" /> Discuss support</a>
        </section>
      </div>
    </main>
  );
}