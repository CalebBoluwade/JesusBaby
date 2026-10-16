"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Flame, Cross } from "lucide-react";
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

const steps = [
  { icon: Cross,  title: "Acknowledge", desc: "Recognize Jesus as your Lord and Savior" },
  { icon: Heart,  title: "Believe",     desc: "Trust in His sacrifice for your sins" },
  { icon: Flame,  title: "Commit",      desc: "Surrender your life to His purpose" },
];

export default function SalvationAltarCall() {
  const [submitted, setSubmitted] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", commitment: false },
  });

  const onSubmit = async (_values: FormValues) => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="bg-app-panel border-y border-app-line px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-app-lime">
            Altar Call
          </p>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-app-text sm:text-5xl">
              Ready to surrender your life to Jesus?
            </h2>
            <p className="max-w-xs text-sm leading-7 text-app-muted">
              No judgment, no shame — only grace, redemption, and eternal life.
            </p>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-10 grid gap-px border border-app-line sm:grid-cols-3"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1, type: "spring", stiffness: 280, damping: 24 }}
                viewport={{ once: true }}
                className="flex flex-col gap-3 bg-app-card p-6"
              >
                <motion.span
                  className="grid h-9 w-9 place-items-center bg-app-lime-dim text-app-lime"
                  whileHover={{ scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.span>
                <p className="text-sm font-black text-app-text">{step.title}</p>
                <p className="text-xs leading-5 text-app-muted">{step.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Prayer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="mb-10 border border-app-line bg-app-card p-8"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-app-muted">
            Pray this with a sincere heart
          </p>
          <blockquote className="border-l-2 border-app-lime pl-5 text-sm leading-8 italic text-app-muted">
            &ldquo;Lord Jesus, I believe You are the Son of God. I confess my
            sins and ask for Your forgiveness. I turn from my old ways and
            invite You into my heart and life. I want to trust and follow You
            as my Lord and Savior. In Your name, I pray. Amen.&rdquo;
          </blockquote>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="border border-app-line bg-app-card p-8"
        >
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="py-8 text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 18 }}
                className="mb-4 block text-4xl"
              >
                ✓
              </motion.span>
              <h4 className="text-xl font-black text-app-text mb-2">
                Welcome to God&apos;s Family!
              </h4>
              <p className="text-sm text-app-muted">
                Check your email for next steps and resources.
              </p>
            </motion.div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-[0.2em] text-app-muted">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} className="border-app-line bg-app-panel text-app-text placeholder:text-app-muted3 focus:border-app-lime" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commitment"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm leading-5 text-app-muted cursor-pointer">
                        I have prayed this prayer and committed my life to Jesus Christ
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-app-lime text-app-bg font-bold hover:opacity-90 transition-opacity"
                >
                  I Accept Jesus Today
                </Button>
              </form>
            </Form>
          )}
        </motion.div>

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          viewport={{ once: true }}
          className="mt-6 border border-app-line bg-app-card p-8"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-app-muted3">What happens next</p>
          <ul className="space-y-3">
            {[
              "You'll receive a welcome email with resources for your new faith journey",
              "Connect with a local church community near you",
              "Get guidance on baptism, discipleship, and spiritual growth",
            ].map((item, idx) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, type: "spring", stiffness: 300, damping: 26 }}
                viewport={{ once: true }}
                className="flex gap-3 text-sm text-app-muted"
              >
                <span className="font-bold text-app-lime shrink-0">→</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
