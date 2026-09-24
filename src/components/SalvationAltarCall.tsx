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

export default function SalvationAltarCall() {
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
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="relative py-20 px-6 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 mb-6">
            <Flame className="w-8 h-8 text-red-400" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Surrender Your Life to Jesus?
          </h2>

          <p className="text-lg text-slate-300 mb-8">
            This is your moment. Jesus is calling you to come as you are. No
            judgment, no shame—only grace, redemption, and eternal life.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Cross,
                title: "Acknowledge",
                desc: "Recognize Jesus as your Lord and Savior",
              },
              {
                icon: Heart,
                title: "Believe",
                desc: "Trust in His sacrifice for your sins",
              },
              {
                icon: Flame,
                title: "Commit",
                desc: "Surrender your life to His purpose",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx + 1}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/50 mb-4">
                  <step.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-8 mb-8">
            <p className="text-slate-300 text-center leading-relaxed mb-6">
              If You&apos;re Ready To Give Your Life to Jesus, Pray This Prayer
              with a Sincere Heart:
            </p>

            <div className="bg-slate-900/50 rounded-lg p-6 text-slate-200 italic text-center leading-relaxed">
              <p className="mb-4">
                &quot;Lord Jesus, I believe You are the Son of God. I Confess my
                sins and ask for Your forgiveness. I turn from my old ways and
                invite You into my heart and life. I want to trust and follow
                You as my Lord and Savior. In Your name, I pray. Amen.&quot;
              </p>
            </div>
          </div>

          {submitted ? (
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
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Your Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
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
                      <FormLabel className="text-slate-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                          className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-slate-400 cursor-pointer">
                          I have prayed this prayer and committed my life to
                          Jesus Christ
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold"
                >
                  I Accept Jesus Today
                </Button>
              </form>
            </Form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            What Happens Next?
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="text-indigo-400 font-bold">→</span>
              <span>
                You&apos;ll Receive a Welcome Email with Resources For Your New
                Faith Journey
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-400 font-bold">→</span>
              <span>Connect with a local church community near you</span>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-400 font-bold">→</span>
              <span>
                Get guidance on baptism, discipleship, and spiritual growth
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
