export default function Footer() {
  return (
    <footer className="relative bg-gray-50 text-center py-6 mt-16">
      {/* Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <p className="text-gray-600 text-sm mt-3">
        © {new Date().getFullYear()} EduSync. All rights reserved.
      </p>
    </footer>
  );
}
