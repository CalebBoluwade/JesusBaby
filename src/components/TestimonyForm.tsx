"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Upload, X, Heart, Sparkles, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./VideoPlayer";

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

// interface TestimonyFormProps {
//   onSubmit?: (data: TestimonyFormValues & { videoFile?: File }) => void;
// }

export default function TestimonyForm() {
  const [videoPreview, setVideoPreview] = useState<string>("");
  const videoInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TestimonyFormValues>({
    resolver: zodResolver(testimonySchema),
    defaultValues: {
      name: "",
      addiction: "",
      testimony: "",
      isAnonymous: false,
      videoFile: undefined,
    },
  });

  const isAnonymous = form.watch("isAnonymous");
  const videoFile = form.watch("videoFile");

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      form.setValue("videoFile", file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview("");
    form.setValue("videoFile", undefined);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
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

  if (form.formState.isSubmitSuccessful) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen h-[calc(100dvh-64px)] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <Sparkles className="w-10 h-10 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Hallelujah!</h3>
        <p className="text-slate-600">
          Your testimony has been shared and will encourage others.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="bg-white rounded-lg shadow-xl p-8 --px-4 --sm:px-6 --lg:px-8 mt-10 mb-20 max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">
          Share Your Victory
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          &#34;They triumphed over him by the blood of the Lamb and by the word
          of their testimony.&#34; - Revelation 12:11
          <br />
          Share how Jesus delivered you!
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  {field.value ? (
                    <EyeOff className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-500" />
                  )}
                  <FormLabel className="mb-0 cursor-pointer">
                    Submit Anonymously
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
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
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
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
                <FormLabel>What were you delivered from?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Addiction, Depression, Anxiety"
                    {...field}
                  />
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
                <FormLabel>Your Testimony</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your story of deliverance..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoFile"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-2">
                  <FormLabel>Upload Video Testimony (Optional)</FormLabel>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                    {!videoFile ? (
                      <div>
                        <Input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="flex flex-col items-center gap-2 mx-auto"
                        >
                          <Upload className="w-8 h-8 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-slate-500">
                            MP4, WebM, or other video formats
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <VideoPlayer
                          src={videoPreview}
                          className="aspect-video max-w-sm mx-auto"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeVideo}
                        >
                          <X className="w-4 h-4" />
                          Remove Video
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Submitting..."
              : "Share Your Testimony"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
