"use client";

import { useState } from "react";
import { BookOpenText, PhoneCall, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const countries = {
  NG: {
    name: "Nigeria",
    hotlines: [
      {
        name: "Befrienders Nigeria",
        phone: "+234 (0) 2241 7368",
        icon: PhoneCall,
        color: "bg-red-500",
      },
      {
        name: "Lagos State Suicide Prevention Initiative",
        phone: "+234 (0) 701 0000 911",
        icon: MessageSquare,
        color: "bg-teal-500",
      },
      {
        name: "Mentally Aware Nigeria Initiative",
        phone: "+234 (0) 700 0000 123",
        icon: BookOpenText,
        color: "bg-blue-500",
      },
    ],
  },
  US: {
    name: "United States",
    hotlines: [
      {
        name: "National Suicide Prevention Lifeline",
        phone: "988",
        icon: PhoneCall,
        color: "bg-red-500",
      },
      {
        name: "SAMHSA National Helpline",
        phone: "1-800-662-4357",
        icon: MessageSquare,
        color: "bg-teal-500",
      },
      {
        name: "Crisis Text Line",
        phone: "Text HOME to 741741",
        icon: BookOpenText,
        color: "bg-blue-500",
      },
    ],
  },
  UK: {
    name: "United Kingdom",
    hotlines: [
      {
        name: "Samaritans",
        phone: "116 123",
        icon: PhoneCall,
        color: "bg-red-500",
      },
      {
        name: "Mind Infoline",
        phone: "0300 123 3393",
        icon: MessageSquare,
        color: "bg-teal-500",
      },
      {
        name: "Shout Crisis Text Line",
        phone: "Text SHOUT to 85258",
        icon: BookOpenText,
        color: "bg-blue-500",
      },
    ],
  },
  CA: {
    name: "Canada",
    hotlines: [
      {
        name: "Canada Suicide Prevention Service",
        phone: "1-833-456-4566",
        icon: PhoneCall,
        color: "bg-red-500",
      },
      {
        name: "Talk Suicide Canada",
        phone: "1-833-456-4566",
        icon: MessageSquare,
        color: "bg-teal-500",
      },
      {
        name: "Crisis Text Line Canada",
        phone: "Text HELLO to 741741",
        icon: BookOpenText,
        color: "bg-blue-500",
      },
    ],
  },
};

export default function ContactPage() {
  const [selectedCountry, setSelectedCountry] = useState<keyof typeof countries>("NG");
  const countryData = countries[selectedCountry];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-8 min-h-screen"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <PhoneCall className="w-8 h-8 text-red-500" />
            Find Support and Guidance
          </h2>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as keyof typeof countries)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {Object.entries(countries).map(([code, data]) => (
              <option key={code} value={code}>
                {data.name}
              </option>
            ))}
          </select>
        </div>

        <p className="text-lg text-gray-700 mb-8 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
          If you are in immediate distress, please reach out. You are not alone. These resources provide immediate, confidential help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-b-4 border-red-600">
            <h3 className="text-2xl font-semibold text-red-700 mb-6">Crisis Hotlines</h3>
            <div className="space-y-4">
              {countryData.hotlines.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <item.icon
                      className={`w-6 h-6 ${item.color.replace("bg-", "text-")}`}
                    />
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500">24/7 Support</p>
                    </div>
                  </div>
                  <a
                    href={item.phone.startsWith("Text") ? `sms:741741` : `tel:${item.phone.replace(/\D/g, "")}`}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all shadow-md ${item.color} text-white hover:opacity-90 whitespace-nowrap`}
                  >
                    {item.phone.startsWith("Text") ? "Text" : "Call"}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-b-4 border-purple-600">
            <h3 className="text-2xl font-semibold text-purple-700 mb-6">Additional Support</h3>
            <ul className="space-y-4 text-gray-700">
              <li>
                <span className="font-bold block mb-1">Christian Counseling</span>
                <p className="text-sm text-gray-600">Contact your local church for pastoral care and faith-based counseling recommendations.</p>
              </li>
              <li>
                <span className="font-bold block mb-1">Professional Help</span>
                <p className="text-sm text-gray-600">Seek guidance from licensed therapists and counselors in your area.</p>
              </li>
              <li>
                <span className="font-bold block mb-1">Support Groups</span>
                <p className="text-sm text-gray-600">Join community support groups for shared experiences and mutual encouragement.</p>
              </li>
              <li>
                <span className="font-bold block mb-1">Email Support</span>
                <a
                  href="mailto:info@yourdeliveranceapp.com"
                  className="text-blue-600 hover:underline text-sm"
                >
                  info@yourdeliveranceapp.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
