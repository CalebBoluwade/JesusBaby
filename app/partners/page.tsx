"use client";

import ProjectCard from "@/components/ProjectCard";
import { motion } from "framer-motion";
import {
  Gift,
  Handshake,
  DollarSign,
  Mail,
  BookMarked,
  Church,
  Flame,
} from "lucide-react";
import { useState } from "react";
import SalvationAltarCallModal from "@/components/SalvationAltarCallModal";

export default function PartnersPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [altarCallOpen, setAltarCallOpen] = useState(false);

  const projects: Project[] = [
    {
      id: 1,
      brandName: "PAB",
      name: "The PAB Chat",
      description:
        "The PAB Chat is a Christ-based podcast that focuses on biblical truths, Lifestyle, relationships and other real life conversations. The PAB chat podcast is curated to reach out to teens and young adults and is aimed at entertaining, building knowledge and shaping narratives about diverse aspects of life through the lens of the scriptures.",
      imageUrl: "/images/PABChat.jpeg",
      projectUrl: "https://linktr.ee/ponmile_",
    },
    {
      id: 2,
      brandName: "Eternel",
      name: "🕊️ Eternel Studios",
      description: "A groundbreaking design project that redefines aesthetics.",
      imageUrl: "/images/eternel.jpeg",
      projectUrl: "https://eternel.com.ng",
    },
    {
      id: 3,
      brandName: "TheEngineRoom",
      name: "TheEngineRoom Podcast",
      description:
        "Building and Transforming lives into the image of Christ.. Discussing everyday life, career, and faith.",
      imageUrl: "/images/theengineroom-podcast.jpg",
      projectUrl: "https://theengineroom.com/podcast",
      comingSoon: true,
    },
    {
      id: 4,
      brandName: "⛺️ Prayer Camps",
      name: "Prayer Camps",
      description:
        "Group Prayer and Bible Study Programs Strengthening each other.",
      imageUrl:
        "https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?auto=format&amp;fit=crop&amp;q=80&amp;w=1160",
      projectUrl: "https://theengineroom.com/podcast",
      comingSoon: true,
    },
  ];

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
      color: "from-red-500 to-pink-500",
    },
    {
      id: "church",
      title: "Church",
      description: "Attend your local church",
      icon: Church,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "donate",
      title: "Make a Donation",
      description: "Support our mission with a financial contribution",
      icon: Gift,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "partner",
      title: "Become a Partner",
      description: "Join us in spreading hope and deliverance",
      icon: Handshake,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "sponsor",
      title: "Sponsor a Program",
      description: "Fund specific recovery and support initiatives",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "contact",
      title: "Get in Touch",
      description: "Inquire about partnership opportunities",
      icon: Mail,
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Side - Partners */}
      <div className="w-full lg:w-3/4 bg-white px-6 py-8 border-r overflow-y-scroll border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-16 px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 --font-bold mb-4">
              Our Projects and Partners
            </h1>
            <p className="text-lg text-slate-600">
              Explore some of the innovative projects we&#39;ve worked on and
              are working together with fellow believers to bring deliverance
              and hope to those in need.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </motion.div>
        {/* </div> */}
      </div>

      {/* Right Side - Partnering/Giving Options */}
      <div className="w-full lg:w-1/4 bg-linear-to-br from-slate-900 to-slate-800 px-6 py-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-extrabold mb-4">Get Involved</h2>
          <p className="text-lg text-slate-300">
            Join us in our mission to bring freedom and hope through Jesus
            Christ
          </p>
        </motion.div>

        <div className="space-y-4">
          {partnerOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  if (option.id === "alterCall") {
                    setAltarCallOpen(true);
                  } else {
                    setSelectedOption(isSelected ? null : option.id);
                  }
                }}
                className={`w-full px-3 py-6 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? `border-white bg-white/10 backdrop-blur-sm`
                    : `border-white/20 hover:border-white/40 bg-white/5`
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-linear-to-br ${option.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{option.title}</h3>
                    <p className="text-slate-300 text-sm">
                      {option.description}
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
                            <button
                              key={amount}
                              className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all font-semibold"
                            >
                              {amount}
                            </button>
                          ))}
                        </div>
                        <button className="w-full py-3 bg-linear-to-r from-red-500 to-pink-500 rounded-lg font-bold hover:shadow-lg transition-all mt-4">
                          Donate Now
                        </button>
                      </div>
                    )}
                    {option.id === "partner" && (
                      <div>
                        <p className="text-sm text-slate-300 mb-3">
                          Let&apos;s work together to expand our reach and
                          impact.
                        </p>
                        <button className="w-full py-3 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg font-bold hover:shadow-lg transition-all">
                          Learn More
                        </button>
                      </div>
                    )}
                    {option.id === "sponsor" && (
                      <div>
                        <p className="text-sm text-slate-300 mb-3">
                          Support specific programs that change lives.
                        </p>
                        <button className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-lg font-bold hover:shadow-lg transition-all">
                          View Programs
                        </button>
                      </div>
                    )}
                    {option.id === "contact" && (
                      <div>
                        <p className="text-sm text-slate-300 mb-3">
                          Email us to discuss partnership opportunities.
                        </p>
                        <a
                          href="mailto:partners@theengine.com"
                          className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 rounded-lg font-bold hover:shadow-lg transition-all block text-center"
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
