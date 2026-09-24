"use client";

import ProjectCard from "@/components/ProjectCard";
import { motion } from "framer-motion";
import {
  BookMarked,
  Church,
  Flame,
  Lock,
  Heart,
  Users,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SalvationAltarCallModal from "@/components/SalvationAltarCallModal";

export default function PartnersPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [altarCallOpen, setAltarCallOpen] = useState(false);
  const router = useRouter();

  const projects: Project[] = [
    {
      id: 7,
      brandName: "JesusBaby Missions",
      name: "Funding Missionaries",
      description:
        "Help equip missionaries with the resources, travel support, and care they need to serve communities and share the gospel.",
      imageUrl:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200&auto=format&fit=crop",
      projectUrl: "/partners/missionary-funding",
    },
    {
      id: 2,
      brandName: "⛺️ Prayer Camps",
      name: "Prayer Camps",
      description:
        "Group Prayer and Bible Study Programs Strengthening each other.",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1668197564635-a54358bf3f00?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      projectUrl: "https://theengineroom.com/podcast",
      comingSoon: true,
    },
    {
      id: 1,
      brandName: "⛺️ In-Person Worship Space / Worship Playlists",
      name: "Worship",
      description:
        "Join Others in Learning about Jesus through Word-Grounded Praise and Worship, Laying Down our Burdens in His Presence.",
      imageUrl:
        "https://images.unsplash.com/photo-1640088429190-a0b556a7a61e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      projectUrl: "modal",
      comingSoon: true,
    },
        {
      id: 3,
      brandName: "⛺️ Christian Social Community",
      name: "Community",
      description:
        "Deepen your faith and connect with like-minded believers in our Christian social community. Share testimonies, pray together, and grow in Christ.",
      imageUrl:
        "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      projectUrl: "modal",
      comingSoon: true,
    },
    {
      id: 4,
      brandName: "PAB",
      name: "The PAB Chat",
      description:
        "The PAB Chat is a Christ-based podcast that focuses on biblical truths, Lifestyle, relationships and other real life conversations. The PAB chat podcast is curated to reach out to teens and young adults and is aimed at entertaining, building knowledge and shaping narratives about diverse aspects of life through the lens of the scriptures.",
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
      description:
        "Building and Transforming lives into the image of Christ.. Discussing everyday life, career, and faith.",
      imageUrl: "/images/theengineroom-podcast.jpg",
      projectUrl: "https://theengineroom.com/podcast",
      comingSoon: true,
    },
  ];

  const colorMap: Record<string, string> = {
    "from-red-500 to-pink-500": "text-red-500",
    "from-indigo-500 to-purple-500": "text-indigo-500",
    "from-emerald-500 to-teal-500": "text-emerald-500",
    "from-amber-500 to-orange-500": "text-amber-500",
  };

  const partnerOptions = [
    {
      id: "alterCall",
      title: "Salvation Call",
      description: "Support our mission by reading a bible chapter today",
      icon: Flame,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "bible",
      title: "Read a Bible",
      description: "Support our mission by reading a bible chapter today",
      icon: BookMarked,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "church",
      title: "Church",
      description: "Attend a local church",
      icon: Church,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "partner",
      title: "Collaborate with Us",
      description:
        "Inquire about partnership opportunities, Join us in spreading the love of Jesus, hope and deliverance",
      icon: Users,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "donate",
      title: "Make a Donation",
      description: "Support our mission with a financial contribution",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      disabled: true,
    },
    {
      id: "sponsor",
      title: "Sponsor a Program",
      description: "Fund specific recovery and support initiatives",
      icon: Zap,
      color: "from-emerald-500 to-teal-500",
      disabled: true,
    },
  ];

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-[radial-gradient(circle_at_15%_10%,rgba(224,231,255,0.9),transparent_30%),linear-gradient(135deg,#f8fafc_0%,#ffffff_48%,#fef3c7_150%)] lg:flex lg:flex-row">
      {/* Left Side - Partners */}
      <div className="w-full border-slate-200 px-5 py-8 sm:px-8 lg:flex-1 lg:border-r lg:px-12 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            className="pb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 max-w-4xl"
          >
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Building together
              <span className="text-slate-500">JesusBaby network</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Projects that turn faith into <span className="text-indigo-600">movement.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Explore some of the innovative projects we&#39;ve worked on and
              are working together with fellow believers to bring deliverance
              and hope to those in need.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
              <span className="border border-slate-900/10 bg-white/70 px-4 py-2">6 active initiatives</span>
              <span className="border border-slate-900/10 bg-white/70 px-4 py-2">One shared mission</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </motion.div>
        {/* </div> */}
      </div>

      {/* Right Side - Partnering/Giving Options */}
      <div className="w-full bg-slate-950 px-5 py-10 text-white sm:px-8 lg:w-[340px] lg:shrink-0 lg:px-7 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Your next step</span>
            <ArrowUpRight className="h-5 w-5 text-slate-500" />
          </div>
          <h2 className="text-4xl font-black tracking-tight">Get Involved</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Join us in our mission to bring freedom and hope through Jesus
            Christ
          </p>
        </motion.div>

        <div className="space-y-3">
          {partnerOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;
            const isDisabled = option.disabled;
            let optionClassName = "border-white/20 hover:border-white/40 bg-white/5";
            if (isDisabled) {
              optionClassName = "border-slate-600 bg-slate-700/30 opacity-50 cursor-not-allowed";
            } else if (isSelected) {
              optionClassName = "border-white bg-white/10 backdrop-blur-sm";
            }
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                disabled={isDisabled}
                onClick={() => {
                  if (option.id === "alterCall") {
                    setAltarCallOpen(true);
                  } else {
                    setSelectedOption(isSelected ? null : option.id);
                  }
                }}
                className={`w-full rounded-2xl px-4 py-4 text-left transition-all ${optionClassName}`}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={!isDisabled ? { scale: 1.2, rotate: 5 } : {}}
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  >
                    {isDisabled ? (
                      <Lock className="w-8 h-8 text-slate-400" />
                    ) : (
                      <Icon className={`w-8 h-8 ${colorMap[option.color]}`} />
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{option.title}</h3>
                    <p
                      className={`text-sm ${
                        isDisabled ? "text-slate-400" : "text-slate-300"
                      }`}
                    >
                      {isDisabled ? "Coming soon" : option.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/20"
                  >
                    {option.id === "donate" && (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-300">
                          Choose an amount:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {["$25", "$50", "$100", "$250"].map((amount) => (
                            <div
                              key={amount}
                              className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all font-semibold cursor-pointer"
                            >
                              {amount}
                            </div>
                          ))}
                        </div>
                        <div className="w-full py-3 bg-linear-to-r from-red-500 to-pink-500 rounded-lg font-bold hover:shadow-lg transition-all mt-4 cursor-pointer text-center">
                          Donate Now
                        </div>
                      </div>
                    )}
                    {option.id === "partner" && (
                      <div>
                        <p className="text-sm text-slate-300 mb-3">
                          Let&apos;s work together to expand our reach and
                          impact.
                        </p>
                        <button
                          type="button"
                          onClick={() => router.push("/partners/collaborate")}
                          className="w-full py-3 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg font-bold hover:shadow-lg transition-all cursor-pointer text-center"
                        >
                          Collaborate with Us
                        </button>
                      </div>
                    )}
                    {option.id === "sponsor" && (
                      <div>
                        <p className="text-sm text-slate-300 mb-3">
                          Support specific programs that change lives.
                        </p>
                        <div className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-lg font-bold hover:shadow-lg transition-all cursor-pointer text-center">
                          View Programs
                        </div>
                      </div>
                    )}
                    {option.id === "contact" && (
                      <div>
                        <p className="text-sm text-slate-300 mb-3">
                          Email us to discuss partnership opportunities.
                        </p>
                        <a
                          href="mailto:partners@theengine.com"
                          className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 rounded-lg font-bold hover:shadow-lg transition-all block text-center cursor-pointer"
                        >
                          Send Email
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      <SalvationAltarCallModal
        open={altarCallOpen}
        onOpenChange={setAltarCallOpen}
      />
    </div>
  );
}
