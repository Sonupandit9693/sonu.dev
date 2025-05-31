export default function CallToAction() {
  return (
    <div className="text-center mt-20">
      <h3 className="text-2xl font-bold text-white mb-4">
        Ready to work together?
      </h3>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        I'm always open to discussing new opportunities and exciting projects.
        Let's create something amazing together!
      </p>

      {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg">
          Download Resume
        </button>
        <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          View Projects
        </button>
      </div> */}
    <div className="w-full h-5 flex items-center justify-center text-sm text-zinc-500 mt-8">
        <p className="text-center ">
          © {new Date().getFullYear()} Sonu Kumar. All rights reserved.
        </p>
      </div>
    </div>
  );
}