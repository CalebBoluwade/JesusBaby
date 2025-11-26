export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Disclaimer</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-700 mb-4">
            All testimonies shared on this platform are shared with permission from the individuals who provided them.
          </p>
          
          <p className="text-slate-600">
            We are committed to respecting the privacy and dignity of all those who share their stories. Each testimony represents a personal journey and is shared voluntarily with explicit consent.
          </p>
        </div>
      </div>
    </div>
  );
}
