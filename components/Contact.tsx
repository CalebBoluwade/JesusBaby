import { BookOpenText, PhoneCall, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  {
    /* Hotlines and Counseling Section */
  }
  const hotlineData = [
    {
      name: "National Crisis Hotline (Mock)",
      phone: "1-800-273-8255",
      icon: PhoneCall,
      color: "bg-red-500",
    },
    {
      name: "Addiction Recovery Support (Mock)",
      phone: "1-800-662-4357",
      icon: MessageSquare,
      color: "bg-teal-500",
    },
    {
      name: "Christian Counseling Referral (Mock)",
      phone: "1-888-555-HOPE",
      icon: BookOpenText,
      color: "bg-blue-500",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="container mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100"
    >
      <h2 className="text-4xl font-bold text-center">
        <PhoneCall className="w-7 h-7 text-red-500" /> Find Support and Guidance
      </h2>

      <h3 className="text-xl font-semibold text-red-700 mb-4">
        Urgent Support Hotlines. If you are in immediate distress, please reach
        out. You are not alone. These mock resources represent places where you
        can find **immediate, confidential help**.
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg border-b-4 border-red-600">
          <div className="space-y-4">
            {hotlineData.map((item) => (
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
                  href={`tel:${item.phone}`}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all shadow-md ${item.color} text-white hover:opacity-90`}
                >
                  Call {item.phone}
                </a>
              </div>
            ))}
          </div>

          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>
              <span className="font-bold">National Addiction Hotline:</span>{" "}
              <a
                href="tel:1-800-662-4357"
                className="text-blue-600 hover:underline"
              >
                1-800-662-HELP (4357)
              </a>
              <p className="text-sm text-gray-500">
                24/7 confidential treatment referral and information service.
              </p>
            </li>
            <li>
              <span className="font-bold">
                National Suicide Prevention Lifeline:
              </span>{" "}
              <a href="tel:988" className="text-blue-600 hover:underline">
                988
              </a>
              <p className="text-sm text-gray-500">
                Available 24/7 for anyone in suicidal crisis or emotional
                distress.
              </p>
            </li>
            <li>
              <span className="font-bold">Crisis Text Line:</span> Text HOME to{" "}
              <a href="sms:741741" className="text-blue-600 hover:underline">
                741741
              </a>
              <p className="text-sm text-gray-500">
                Connect with a crisis counselor for free, 24/7.
              </p>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-b-4 border-purple-600">
          <h3 className="text-3xl font-semibold text-purple-700 mb-4">
            Christian Counseling & Referrals
          </h3>
          <p className="text-gray-700 mb-4">
            Seek guidance and support from faith-based counselors who understand
            your journey.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>
              <span className="font-bold">Christian Counselors Directory:</span>{" "}
              <a
                href="https://www.aacc.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                AACC Website
              </a>
              <p className="text-sm text-gray-500">
                Find accredited Christian counselors in your area.
              </p>
            </li>
            <li>
              <span className="font-bold">Local Church Referrals:</span> Contact
              your local church for pastoral care or counseling recommendations.
              <p className="text-sm text-gray-500">
                Many churches offer support groups and guidance.
              </p>
            </li>
            <li>
              <span className="font-bold">Email Us:</span>{" "}
              <a
                href="mailto:info@yourdeliveranceapp.com"
                className="text-blue-600 hover:underline"
              >
                info@yourdeliveranceapp.com
              </a>
              <p className="text-sm text-gray-500">
                For general inquiries or to ask for prayer.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
