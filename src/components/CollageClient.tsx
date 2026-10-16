"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import StoryCard from "@/components/StoryCard";
import VideoPlayer from "@/components/VideoPlayer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { X, Upload, Eye, EyeOff, Heart, Sparkles } from "lucide-react";

const CategoryDescriptions: Record<string, string> = {
  Alcohol: "Stories of freedom from alcohol dependency",
  "Drug Addiction": "Testimonies of deliverance from substance abuse",
  Depression: "Healing and hope through faith and God's love",
};

const userTestimonials: Testimonial[] = [
  { id: 1, name: "Alex Johnson", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", addiction: "Drug Addiction", testimony: "After 10 years in drug addiction, Jesus set me free completely. I'm now 3 years clean!" },
  { id: 2, name: "Sarah Chen", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", addiction: "Depression", testimony: "God's love healed my depression when nothing else could. He gave me a new purpose in life." },
  { id: 3, name: "Mike Rodriguez", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 4, name: "Emma Wilson", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 5, name: "David Kim", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 6, name: "Lisa Brown", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 7, name: "James Taylor", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 8, name: "Anna Davis", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 9, name: "Chris Lee", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 10, name: "Maya Patel", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 11, name: "Tom Anderson", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 12, name: "Zoe Martinez", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", videoUrl: "/videos/5199861-hd_1080_1920_25fps.mp4", addiction: "Alcohol", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
  { id: 13, name: "Zoey Bailey", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", videoUrl: "/videos/5199861-hd_1080_1920_25fps.mp4", addiction: "Heartbreak", testimony: "Through Jesus Christ, I was delivered from 15 years of alcohol addiction. His grace is sufficient!" },
];

const testimonySchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    addiction: z.string().min(2, "Please specify what you were delivered from"),
    testimony: z.string().min(10, "Testimony must be at least 10 characters"),
    isAnonymous: z.boolean(),
    videoFile: z.custom<File | undefined>(),
  })
  .refine((data) => data.isAnonymous || (data.name && data.name.length >= 2), {
    message: "Name is required unless submitting anonymously",
    path: ["name"],
  });

type TestimonyFormValues = z.infer<typeof testimonySchema>;

function TestimonyModal({ onClose }: { onClose: () => void }) {
  const [videoPreview, setVideoPreview] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TestimonyFormValues>({
    resolver: zodResolver(testimonySchema),
    defaultValues: { name: "", addiction: "", testimony: "", isAnonymous: false, videoFile: undefined },
  });

  const isAnonymous = form.watch("isAnonymous");
  const videoFile = form.watch("videoFile");

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("video/")) {
      form.setValue("videoFile", file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview("");
    form.setValue("videoFile", undefined);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleFormSubmit = async (values: TestimonyFormValues) => {
    try {
      await axios.post("/api/testimonies", {
        name: values.name || "",
        addiction: values.addiction,
        testimony: values.testimony,
        isAnonymous: values.isAnonymous,
      });
      form.reset();
      removeVideo();
    } catch (error) {
      console.error("Error submitting testimony:", error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-lg -translate-y-1/2 border border-app-line bg-app-card shadow-2xl overflow-y-auto max-h-[90dvh]"
      >
        <div className="flex items-center justify-between border-b border-app-line px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center bg-app-lime-dim text-app-lime">
              <Heart className="h-4 w-4 fill-current" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-app-lime">Share your story</p>
              <p className="text-sm font-black text-app-text">Share Your Victory</p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="p-1.5 text-app-muted hover:text-app-text transition-colors"
            aria-label="Close"
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="p-6">
          {form.formState.isSubmitSuccessful ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 18 }}
                className="mx-auto mb-4 grid h-16 w-16 place-items-center bg-app-lime-dim text-app-lime"
              >
                <Sparkles className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-black text-app-text mb-2">Hallelujah!</h3>
              <p className="text-sm text-app-muted">Your testimony has been shared and will encourage others.</p>
              <button
                onClick={onClose}
                className="mt-6 bg-app-lime px-6 py-2.5 text-sm font-bold text-app-bg hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
                <p className="text-xs leading-5 text-app-muted">
                  &ldquo;They triumphed over him by the blood of the Lamb and by the word of their testimony.&rdquo; — Revelation 12:11
                </p>

                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between border border-app-line bg-app-panel p-3">
                      <div className="flex items-center gap-2">
                        {field.value ? <EyeOff className="h-4 w-4 text-app-muted" /> : <Eye className="h-4 w-4 text-app-muted" />}
                        <FormLabel className="mb-0 cursor-pointer text-sm text-app-text">Submit Anonymously</FormLabel>
                      </div>
                      <FormControl>
                        <Input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4 cursor-pointer" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!isAnonymous && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-[0.2em] text-app-muted">Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} className="border-app-line bg-app-panel text-app-text placeholder:text-app-muted3 focus:border-app-lime" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="addiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-[0.2em] text-app-muted">Delivered from</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Addiction, Depression, Anxiety" {...field} className="border-app-line bg-app-panel text-app-text placeholder:text-app-muted3 focus:border-app-lime" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="testimony"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-[0.2em] text-app-muted">Your Testimony</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Share your story of deliverance..." rows={4} {...field} className="border-app-line bg-app-panel text-app-text placeholder:text-app-muted3 focus:border-app-lime resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoFile"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-[0.2em] text-app-muted">Video Testimony (Optional)</FormLabel>
                      <div className="border border-dashed border-app-line bg-app-panel p-5 text-center hover:border-app-lime transition-colors">
                        {!videoFile ? (
                          <>
                            <Input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
                            <button type="button" onClick={() => videoInputRef.current?.click()} className="flex flex-col items-center gap-2 mx-auto">
                              <Upload className="h-6 w-6 text-app-muted2" />
                              <span className="text-sm text-app-muted">Click to upload</span>
                              <span className="text-xs text-app-muted2">MP4, WebM, or other video formats</span>
                            </button>
                          </>
                        ) : (
                          <div className="space-y-3">
                            <VideoPlayer src={videoPreview} className="aspect-video max-w-xs mx-auto" />
                            <Button type="button" variant="destructive" size="sm" onClick={removeVideo}>
                              <X className="h-3.5 w-3.5 mr-1" /> Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-app-lime text-app-bg font-bold hover:opacity-90 transition-opacity">
                  {form.formState.isSubmitting ? "Submitting..." : "Share Your Testimony"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default function CollageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const categories = useMemo(() => Array.from(new Set(userTestimonials.map((t) => t.addiction))).sort(), []);

  const filtered = useMemo(
    () => selectedCategory ? userTestimonials.filter((t) => t.addiction === selectedCategory) : userTestimonials,
    [selectedCategory]
  );

  return (
    <>
      <div className="min-h-screen h-[calc(100dvh-64px)] flex flex-col lg:flex-row bg-app-bg">
        {/* Sidebar */}
        <div className="w-full lg:w-1/6 px-6 py-8 text-app-text bg-app-panel border-r border-app-line">
          <div className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-app-muted">Testimony Categories</div>
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category, idx) => (
              <AccordionItem key={category} value={`item-${idx}`}>
                <AccordionTrigger>{category}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3">
                  <p className="text-xs text-app-muted2 mb-2">
                    {CategoryDescriptions[category] || "Read inspiring testimonies"}
                  </p>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      selectedCategory === category ? "bg-app-lime text-app-bg" : "bg-app-card text-app-muted hover:text-app-text"
                    }`}
                  >
                    Filter by {category}
                  </button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="w-full mt-6 px-4 py-2 rounded text-sm font-medium bg-app-card text-app-muted transition-colors hover:text-app-text"
            >
              Reset (Show All)
            </button>
          )}
        </div>

        {/* Main */}
        <div className="w-full lg:w-5/6 px-6 py-8 overflow-y-scroll border-r border-app-line">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h2 className="text-4xl font-extrabold mb-4 text-app-text">Wall of Victory</h2>
            <p className="text-lg text-app-muted">
              Hover over and read real stories of real people who found real freedom in Christ. These are not just stories; they are evidence of God&#39;s power to change lives.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-6 items-center max-md:justify-center">
            {filtered.map((user, index) => (
              <motion.div
                key={user.id}
                className="cursor-pointer"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                transition={{ duration: 0.5, delay: index * 0.05, type: "spring", stiffness: 100 }}
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="w-18 h-18 border-4 border-app-line shadow-lg transition-colors hover:border-app-lime">
                      <AvatarImage src={user.image} alt={user.name} className="object-cover" />
                      <AvatarFallback className="bg-linear-to-br from-amber-600 to-yellow-600 text-white font-semibold">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent asChild>
                    <StoryCard data={user} />
                  </PopoverContent>
                </Popover>
              </motion.div>
            ))}

            {/* + button — opens modal */}
            <motion.button
              onClick={() => setShareOpen(true)}
              aria-label="Share your testimony"
              className="w-18 h-18 flex items-center justify-center border-4 border-dashed border-app-line rounded-full cursor-pointer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, borderColor: "var(--app-lime)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, delay: filtered.length * 0.05, type: "spring", stiffness: 100 }}
            >
              <span className="text-3xl leading-none text-app-lime font-bold">+</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Testimony modal */}
      <AnimatePresence>
        {shareOpen && <TestimonyModal onClose={() => setShareOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
