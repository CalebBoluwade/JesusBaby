'use client';

import { motion } from 'framer-motion';
import { Share2, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const StoryCard = ({ data }: { data: Testimonial }) => {
  const gradients = [
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-purple-500",
  ];
  const randomGradient = gradients[data.name.length % gradients.length];

  const shareText = `"${data.testimony}" - ${data.name}, delivered from ${data.addiction} through Jesus Christ. #JesusBaby #Deliverance`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    const urls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full max-md:max-w-sm"
    >
      <div className={`h-2 w-full bg-linear-to-r ${randomGradient}`} />
      <div className="p-6 flex-1 flex flex-col bg-accent">
        {data.videoUrl && (
          <div className="mb-4 -mx-6 -mt-6">
            <VideoPlayer src={data.videoUrl} className="aspect-video" />
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">
            {data.addiction}
          </span>
        </div>
        <p className="text-slate-600 mb-6 flex-1 leading-relaxed text-sm md:text-base">
          &#34;{data.testimony}&#34;
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${randomGradient} flex items-center justify-center text-white font-bold text-lg`}
            >
              {data.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900">{data.name}</p>
              <p className="text-xs text-slate-400">Delivered</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-indigo-600"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-blue-400"
              title="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-green-500"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoryCard;