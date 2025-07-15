export default function CallToAction() {
  return (
    <div className="text-center mt-20">
      <h3 className="text-2xl font-bold text-white mb-4">Ready to work together?</h3>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        I'm always open to discussing new opportunities and exciting projects. Let's create something amazing together!
      </p>

      <div className="w-full h-5 flex items-center justify-center text-sm text-zinc-500 mt-8">
        <p className="text-center">© {new Date().getFullYear()} Sonu Kumar. All rights reserved.</p>
      </div>
    </div>
  )
}
