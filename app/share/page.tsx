"use client";
import TestimonyForm from "@/components/TestimonyForm";

export default function SharePage() {
  return (
    <TestimonyForm />

    // {/* <form onSubmit={handleSubmit} className="space-y-6">
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //     <div className="space-y-2">
    //       <label className="text-sm font-medium text-slate-700">
    //         First Name (or Alias)
    //       </label>
    //       <input
    //         required
    //         type="text"
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
    //         placeholder="e.g. John"
    //       />
    //     </div>
    //     <div className="space-y-2">
    //       <label className="text-sm font-medium text-slate-700">
    //         Delivered From
    //       </label>
    //       <input
    //         required
    //         type="text"
    //         value={addiction}
    //         onChange={(e) => setAddiction(e.target.value)}
    //         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
    //         placeholder="e.g. Gambling, Depression, Drugs"
    //       />
    //     </div>
    //   </div>

    //   <div className="space-y-2">
    //     <label className="text-sm font-medium text-slate-700">
    //       Your Testimony
    //     </label>
    //     <textarea
    //       required
    //       value={story}
    //       onChange={(e) => setStory(e.target.value)}
    //       rows={5}
    //       className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
    //       placeholder="Share what changed and how Jesus helped you find freedom..."
    //     />
    //     <p className="text-xs text-slate-400 text-right">
    //       Keep it brief and encouraging.
    //     </p>
    //   </div>

    //   <div className="space-y-2">
    //     <label className="text-sm font-medium text-slate-700">
    //       Video Testimony (Optional)
    //     </label>
    //     <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
    //       {!videoPreview ? (
    //         <div>
    //           <input
    //             ref={videoInputRef}
    //             type="file"
    //             accept="video/*"
    //             onChange={handleVideoChange}
    //             className="hidden"
    //           />
    //           <button
    //             type="button"
    //             onClick={() => videoInputRef.current?.click()}
    //             className="flex flex-col items-center gap-2 mx-auto"
    //           >
    //             <Upload className="w-8 h-8 text-slate-400" />
    //             <span className="text-sm text-slate-600">
    //               Click to upload or drag and drop
    //             </span>
    //             <span className="text-xs text-slate-500">
    //               MP4, WebM, or other video formats
    //             </span>
    //           </button>
    //         </div>
    //       ) : (
    //         <div className="space-y-4">
    //           <VideoPlayer
    //             src={videoPreview}
    //             className="aspect-video max-w-sm mx-auto"
    //           />
    //           <button
    //             type="button"
    //             onClick={removeVideo}
    //             className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    //           >
    //             <X className="w-4 h-4" />
    //             Remove Video
    //           </button>
    //         </div>
    //       )}
    //     </div>
    //   </div>

    //   <button
    //     type="submit"
    //     disabled={isSubmitting}
    //     className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    //   >
    //     {isSubmitting ? (
    //       <Activity className="w-5 h-5 animate-spin" />
    //     ) : (
    //       <Plus className="w-5 h-5" />
    //     )}
    //     {isSubmitting ? "Posting..." : "Post Testimony"}
    //   </button>
    // </form> */}
  );
}
