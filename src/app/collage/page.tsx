"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StoryCard from "@/components/StoryCard";

const CategoryDescriptions: Record<string, string> = {
  Alcohol: "Stories of freedom from alcohol dependency",
  "Drug Addiction": "Testimonies of deliverance from substance abuse",
  Depression: "Healing and hope through faith and God's love",
};

// Mock user data with headshots
const userTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Johnson",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    addiction: "Drug Addiction",
    testimony:
      "After 10 years in drug addiction, Jesus set me free completely. I'm now 3 years clean!",
  },
  {
    id: 2,
    addiction: "Depression",
    name: "Sarah Chen",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    testimony:
      "God's love healed my depression when nothing else could. He gave me a new purpose in life.",
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
  {
    id: 4,
    name: "Emma Wilson",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
  {
    id: 5,
    name: "David Kim",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
  {
    id: 6,
    name: "Lisa Brown",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
  {
    id: 7,
    name: "James Taylor",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
  {
    id: 8,
    name: "Anna Davis",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
  {
    id: 9,
    name: "Chris Lee",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
  {
    id: 10,
    name: "Maya Patel",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
  {
    id: 11,
    name: "Tom Anderson",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
  {
    id: 12,
    name: "Zoe Martinez",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    videoUrl: "/videos/5199861-hd_1080_1920_25fps.mp4",
    addiction: "Alcohol",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
   {
    id: 13,
    name: "Zoey Bailey",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    videoUrl: "/videos/5199861-hd_1080_1920_25fps.mp4",
    addiction: "Heartbreak",
    testimony:
      "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!",
  },
];

export default function CollagePage() {
  const [SelectedCategory, SetSelectedCategory] = useState<string | null>(null);

  const Categories = useMemo(() => {
    const unique = Array.from(new Set(userTestimonials.map((t) => t.addiction)));
    return unique.sort();
  }, []);

  const FilteredTestimonials = useMemo(() => {
    return SelectedCategory
      ? userTestimonials.filter((t) => t.addiction === SelectedCategory)
      : userTestimonials;
  }, [SelectedCategory]);

  if (!userTestimonials || userTestimonials.length === 0) {
    return (
      <div className="rounded-lg p-8 bg-white shadow text-center">
        No Testimonies yet — be the first to share!
      </div>
    );
  }

  return (
    <div className="min-h-screen h-[calc(100dvh-64px)] flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/6 bg-linear-to-br from-slate-900 to-slate-800 px-6 py-8 text-white">
        <div className="mb-6">Testimony Categories</div>

        <Accordion type="single" collapsible className="w-full">
          {Categories.map((category, idx) => (
            <AccordionItem key={category} value={`item-${idx}`}>
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3">
                <p className="text-xs text-slate-400 mb-2">
                  {CategoryDescriptions[category] || "Read inspiring testimonies"}
                </p>
                <button
                  onClick={() => SetSelectedCategory(category)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    SelectedCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                  }`}
                >
                  Filter by {category}
                </button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {SelectedCategory && (
          <button
            onClick={() => SetSelectedCategory(null)}
            className="w-full mt-6 px-4 py-2 bg-slate-700 text-slate-200 rounded hover:bg-slate-600 transition-colors text-sm font-medium"
          >
            Reset (Show All)
          </button>
        )}
      </div>

      <div className="w-full lg:w-5/6 px-6 py-8 border-r overflow-y-scroll border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-extrabold mb-4">Wall of Victory</h2>
          <p className="text-lg text-slate-300">
            Hover over and read real stories of real people who found real
            freedom in Christ. These are not just stories; they are evidence of
            God&#39;s power to change lives.
          </p>
        </motion.div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-6 items-center max-md:justify-center">
            {FilteredTestimonials.map((user, index) => (
              <motion.div
                key={user.id}
                className="cursor-pointer"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="w-18 h-18 border-4 border-white shadow-lg transition-colors hover:border-indigo-200">
                      <AvatarImage
                        src={user.image}
                        alt={user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-linear-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent asChild>
                    <StoryCard data={user} />
                  </PopoverContent>
                </Popover>
              </motion.div>
            ))}

            <motion.a
              className="w-18 h-18 flex items-center justify-center border-4 border-dashed border-white rounded-full cursor-pointer hover:border-indigo-200 transition-colors"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              // transition={{
              //   duration: 0.5,
              //   delay: FilteredTestimonials.length * 0.05,
              //   type: "spring",
              //   stiffness: 100,
              // }}
              href="/share"
              target="_blank"
              // onClick={() => {
              //   window.open(
              //     "/share",
              //     "_blank"
              //   );
              // }}
            >
              <span className="text-3xl mb-2 text-white font-bold">+</span>
            </motion.a>
          </div>
        </div>
      </div>

      {/* <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Wall of Victory
        </h1>

        <p className="text-slate-600">
          Hover over and read real stories of real people who found real freedom
          in Christ. These are not just stories; they are evidence of God&#39;s
          power to change lives.
        </p>
      </div> */}

      {/* <div className="container mx-auto px-6 pb-12">
        <div className="flex flex-wrap gap-6 justify-center">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              className="cursor-pointer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
              }}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="w-18 h-18 border-4 border-white shadow-lg transition-colors hover:border-indigo-200">
                    <AvatarImage
                      src={user.image}
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-linear-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent asChild>
                  <StoryCard data={user} />
                </PopoverContent>
              </Popover>
            </motion.div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
