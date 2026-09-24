"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Flame, Cross } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  commitment: z.boolean().refine((val) => val === true, {
    message: "You must confirm your commitment",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface SalvationAltarCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SalvationAltarCallModal({
  open,
  onOpenChange,
}: SalvationAltarCallModalProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      commitment: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onOpenChange(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-linear-to-b from-slate-900 to-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Altar Call</h2>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Ready to Surrender Your Life to Jesus?
                  </h3>
                  <p className="text-slate-300">
                    This is your moment. Jesus is calling you to come as you
                    are.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Cross, title: "Acknowledge" },
                    { icon: Heart, title: "Believe" },
                    { icon: Flame, title: "Commit" },
                  ].map((step, idx) => (
                    <div key={idx} className="text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 mb-2">
                        <step.icon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {step.title}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-3 uppercase tracking-wide">
                    Pray this prayer:
                  </p>
                  <p className="text-slate-200 text-sm leading-relaxed italic">
                    &#34;Lord Jesus, I believe You are the Son of God. I confess my
                    sins and ask for Your forgiveness. I turn from my old ways
                    and invite You into my heart and life. I want to trust and
                    follow You as my Lord and Savior. In Your name, I pray.
                    Amen.&#34;
                  </p>
                </div>

                {!submitted ? (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                {...field}
                                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                {...field}
                                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="commitment"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-xs text-slate-400 cursor-pointer">
                                I have prayed this prayer and committed my life
                                to Jesus Christ
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-sm"
                      >
                        I Accept Jesus Today
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 mb-4">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      Welcome to God&apos;s Family!
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Check your email for next steps and resources
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
