export default function Newsletter() {
  return (
    <div className="text-center">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
        <p className="text-gray-300 mb-6">
          Subscribe to my newsletter to get the latest articles and tutorials delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105">
            Subscribe
          </button>
        </div>
      </div>
      <div className="w-full h-16 flex items-center justify-center text-sm text-zinc-500">
        <p className="text-center">
          © {new Date().getFullYear()} Sonu Kumar. All rights reserved.
        </p>
      </div>
      {/* <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
        Load More Articles
      </button> */}
    </div>
  );
}