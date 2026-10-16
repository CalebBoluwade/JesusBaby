"use client";

import ProjectCard from "@/components/ProjectCard";
import { motion } from "framer-motion";
import { BookMarked, Church, Flame, Heart, Users, ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SalvationAltarCallModal from "@/components/SalvationAltarCallModal";

const projects: Project[] = [
  {
    id: 7,
    brandName: "JesusBaby Missions",
    name: "Funding Missionaries",
    description: "Help equip missionaries with the resources, travel support, and care they need to serve communities and share the gospel.",
    imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200&auto=format&fit=crop",
    projectUrl: "/partners/missionary-funding",
  },
  {
    id: 2,
    brandName: "⛺️ Prayer Camps",
    name: "Prayer Camps",
    description: "Group Prayer and Bible Study Programs strengthening each other.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1668197564635-a54358bf3f00?q=80&w=687&auto=format&fit=crop",
    projectUrl: "https://theengineroom.com/podcast",
    comingSoon: true,
  },
  {
    id: 1,
    brandName: "⛺️ In-Person Worship Space",
    name: "Worship",
    description: "Join Others in Learning about Jesus through Word-Grounded Praise and Worship, Laying Down our Burdens in His Presence.",
    imageUrl: "https://images.unsplash.com/photo-1640088429190-a0b556a7a61e?q=80&w=1470&auto=format&fit=crop",
    projectUrl: "modal",
    comingSoon: true,
  },
  {
    id: 3,
    brandName: "⛺️ Christian Social Community",
    name: "Community",
    description: "Deepen your faith and connect with like-minded believers. Share testimonies, pray together, and grow in Christ.",
    imageUrl: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?q=80&w=685&auto=format&fit=crop",
    projectUrl: "modal",
    comingSoon: true,
  },
  {
    id: 4,
    brandName: "PAB",
    name: "The PAB Chat",
    description: "A Christ-based podcast focused on biblical truths, lifestyle, relationships and real life conversations through the lens of scripture.",
    imageUrl: "/images/PABChat.jpeg",
    projectUrl: "https://linktr.ee/ponmile_",
  },
  {
    id: 5,
    brandName: "Eternel",
    name: "🕊️ Eternel Studios",
    description: "A groundbreaking design project that redefines aesthetics.",
    imageUrl: "/images/eternel.jpeg",
    projectUrl: "https://eternel.com.ng",
  },
  {
    id: 6,
    brandName: "TheEngineRoom",
    name: "TheEngineRoom Podcast",
    description: "Building and Transforming lives into the image of Christ. Discussing everyday life, career, and faith.",
    imageUrl: "/images/theengineroom-podcast.jpg",
    projectUrl: "https://theengineroom.com/podcast",
    comingSoon: true,
  },
];

const partnerOptions = [
  { id: "alterCall", title: "Salvation Call", description: "Take the first step — give your life to Christ today.", icon: Flame },
  { id: "bible", title: "Read the Bible", description: "Support our mission by reading a chapter today.", icon: BookMarked },
  { id: "church", title: "Find a Church", description: "Attend a local church and grow in community.", icon: Church },
  { id: "partner", title: "Collaborate with Us", description: "Inquire about partnership opportunities with JesusBaby.", icon: Users },
  { id: "donate", title: "Make a Donation", description: "Support our mission with a financial contribution.", icon: Heart, disabled: true },
];

export default function PartnersClient() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [altarCallOpen, setAltarCallOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-app-bg px-5 py-10 text-app-text sm:px-8 lg:px-12">

      {/* Header */}
      <header className="mb-10 border-b border-app-line pb-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-app-lime">
          Building together · The Live for Christ network
        </p>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-app-text sm:text-6xl">
            Projects that turn faith<br className="hidden sm:block" /> into{" "}
            <span className="text-app-lime">movement.</span>
          </h1>
          <p className="max-w-sm text-sm leading-7 text-app-muted">
            Innovative initiatives built with fellow believers to bring deliverance and hope to those in need.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="border border-app-line px-4 py-2 text-sm font-semibold text-app-muted">
            {projects.length} active initiatives
          </span>
          <span className="border border-app-line px-4 py-2 text-sm font-semibold text-app-muted">
            One shared mission
          </span>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_300px]">

        {/* Projects grid */}
        <section>
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-app-muted3">
            Active initiatives
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Get Involved sidebar */}
        <aside>
          <div className="sticky top-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-app-muted3">
                Your next step
              </h2>
              <ArrowUpRight className="h-4 w-4 text-app-muted3" />
            </div>
            <p className="mb-5 text-2xl font-black tracking-tight text-app-text">Get Involved</p>

            <div className="space-y-2">
              {partnerOptions.map((option, i) => {
                const Icon = option.icon;
                const isSelected = selectedOption === option.id;
                const isDisabled = option.disabled;

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (option.id === "alterCall") { setAltarCallOpen(true); return; }
                        if (!isDisabled) setSelectedOption(isSelected ? null : option.id);
                      }}
                      className={`w-full border text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        isSelected
                          ? "border-app-lime bg-app-lime-dim"
                          : "border-app-line bg-app-card hover:border-app-lime/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center ${
                          isSelected ? "bg-app-lime text-app-bg" : "bg-app-panel text-app-muted"
                        }`}>
                          {isDisabled ? <Lock className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-app-text">{option.title}</p>
                          <p className="truncate text-xs text-app-muted2">
                            {isDisabled ? "Coming soon" : option.description}
                          </p>
                        </div>
                        {!isDisabled && (
                          <ArrowRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                            isSelected ? "rotate-90 text-app-lime" : "text-app-muted3"
                          }`} />
                        )}
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="border-t border-app-line px-4 pb-4 pt-3"
                        >
                          {option.id === "partner" && (
                            <button
                              type="button"
                              onClick={() => router.push("/partners/collaborate")}
                              className="w-full bg-app-lime px-4 py-2.5 text-sm font-bold text-app-bg transition-opacity hover:opacity-90"
                            >
                              Go to Collaborate →
                            </button>
                          )}
                          {option.id === "bible" && (
                            <a
                              href="https://www.bible.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full bg-app-lime px-4 py-2.5 text-center text-sm font-bold text-app-bg transition-opacity hover:opacity-90"
                            >
                              Open Bible.com →
                            </a>
                          )}
                          {option.id === "church" && (
                            <a
                              href="https://www.google.com/maps/search/church+near+me"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full bg-app-lime px-4 py-2.5 text-center text-sm font-bold text-app-bg transition-opacity hover:opacity-90"
                            >
                              Find a church near you →
                            </a>
                          )}
                        </motion.div>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      <SalvationAltarCallModal open={altarCallOpen} onOpenChange={setAltarCallOpen} />
    </div>
  );
}
