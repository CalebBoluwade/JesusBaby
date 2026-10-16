"use client";

import { useState } from "react";
import { PhoneCall, MessageSquare, BookMarked, Heart, Users, BookOpenText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const countries = {
  NG: {
    name: "Nigeria 🇳🇬",
    hotlines: [
      { name: "Befrienders Nigeria", phone: "+234 (0) 2241 7368", href: "tel:+23422417368", text: false },
      { name: "Lagos Suicide Prevention", phone: "+234 (0) 701 000 0911", href: "tel:+2347010000911", text: false },
      { name: "Mentally Aware Nigeria (MANI)", phone: "+234 (0) 700 000 0123", href: "tel:+2347000000123", text: false },
    ],
  },
  US: {
    name: "United States 🇺🇸",
    hotlines: [
      { name: "National Suicide Prevention Lifeline", phone: "988", href: "tel:988", text: false },
      { name: "SAMHSA National Helpline", phone: "1-800-662-4357", href: "tel:18006624357", text: false },
      { name: "Crisis Text Line", phone: "Text HOME to 741741", href: "sms:741741", text: true },
    ],
  },
  UK: {
    name: "United Kingdom 🇬🇧",
    hotlines: [
      { name: "Samaritans", phone: "116 123", href: "tel:116123", text: false },
      { name: "Mind Infoline", phone: "0300 123 3393", href: "tel:03001233393", text: false },
      { name: "Shout Crisis Text Line", phone: "Text SHOUT to 85258", href: "sms:85258", text: true },
    ],
  },
  CA: {
    name: "Canada 🇨🇦",
    hotlines: [
      { name: "Canada Suicide Prevention Service", phone: "1-833-456-4566", href: "tel:18334564566", text: false },
      { name: "Crisis Text Line Canada", phone: "Text HELLO to 741741", href: "sms:741741", text: true },
      { name: "Kids Help Phone", phone: "1-800-668-6868", href: "tel:18006686868", text: false },
    ],
  },
};

const faithResources = [
  {
    icon: BookMarked,
    title: "Read the Bible",
    description: "Start with Psalms 23, John 3, or Romans 8. God's word is alive and active.",
    href: "https://www.bible.com",
    cta: "Open Bible.com",
    external: true,
  },
  {
    icon: Heart,
    title: "Christian Counseling",
    description: "Contact your local church for pastoral care and faith-based counseling.",
    href: "mailto:info@jesusbaby.com",
    cta: "Email us",
    external: false,
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Share your testimony, pray with others, and grow together in Christ.",
    href: "/share",
    cta: "Share your story",
    external: false,
  },
  {
    icon: BookOpenText,
    title: "Deliverance Resources",
    description: "Curated materials on freedom, healing, and walking in the Spirit.",
    href: "/library",
    cta: "Visit the library",
    external: false,
  },
];

type CountryKey = keyof typeof countries;

export default function ContactPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>("NG");
  const country = countries[selectedCountry];

  return (
    <div className="min-h-screen bg-app-bg px-5 py-10 text-app-text sm:px-8 lg:px-12">

      {/* Header */}
      <header className="mb-10 border-b border-app-line pb-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-app-lime">
          Deliverance &amp; Help
        </p>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-app-text sm:text-6xl">
            You are not alone.{" "}
            <span className="text-app-lime">Help is here.</span>
          </h1>
          <blockquote className="max-w-xs text-sm leading-7 text-app-muted">
            &ldquo;He leads me beside still waters. He restores my soul.&rdquo;
            <cite className="mt-1 block not-italic text-xs font-bold uppercase tracking-widest text-app-muted3">
              — Psalm 23:2–3
            </cite>
          </blockquote>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-2">

        {/* Crisis Hotlines */}
        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-app-muted3">
                Immediate support
              </p>
              <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-app-text">
                <PhoneCall className="h-5 w-5 text-red-400" />
                Crisis Hotlines
              </h2>
            </div>
            <label className="flex items-center gap-2 border border-app-line bg-app-card px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted3">Country</span>
              <select
                title="Select Country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as CountryKey)}
                className="bg-transparent text-sm font-semibold text-app-text outline-none"
              >
                {Object.entries(countries).map(([code, data]) => (
                  <option key={code} value={code} className="bg-app-panel">{data.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-5 border-l-2 border-red-500 py-2 pl-4 text-sm leading-6 text-app-muted">
            If you are in immediate distress, please reach out. These resources provide confidential, 24/7 help.
          </div>

          <div className="space-y-2">
            {country.hotlines.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center justify-between border border-app-line bg-app-card px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-app-text">{item.name}</p>
                  <p className="text-xs text-app-muted2">{item.phone}</p>
                </div>
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 bg-app-lime px-3 py-1.5 text-xs font-bold text-app-bg transition-opacity hover:opacity-90"
                >
                  {item.text
                    ? <><MessageSquare className="h-3 w-3" /> Text</>
                    : <><PhoneCall className="h-3 w-3" /> Call</>
                  }
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Faith Resources */}
        <section>
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-app-muted3">
              Faith &amp; community
            </p>
            <h2 className="text-2xl font-black tracking-tight text-app-text">
              Additional Support
            </h2>
          </div>

          <div className="space-y-2">
            {faithResources.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.title}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group flex items-start gap-4 border border-app-line bg-app-card px-4 py-4 transition-colors hover:border-app-lime/40"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center bg-app-lime-dim text-app-lime transition-colors group-hover:bg-app-lime group-hover:text-app-bg">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-app-text">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-app-muted2">{item.description}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs font-bold text-app-lime">
                      {item.cta} <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </section>
      </div>

      {/* Bottom verse */}
      <div className="mt-16 border border-app-line bg-app-panel py-12 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-app-lime">
          A word for you
        </p>
        <blockquote className="text-2xl font-black tracking-tight text-app-text sm:text-3xl">
          &ldquo;Come to me, all who are weary and burdened,
          <br className="hidden sm:block" /> and I will give you rest.&rdquo;
        </blockquote>
        <cite className="mt-3 block not-italic text-xs font-bold uppercase tracking-widest text-app-muted3">
          — Matthew 11:28
        </cite>
      </div>
    </div>
  );
}
