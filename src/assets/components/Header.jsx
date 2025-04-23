export default function Header() {
    return (
        <header className="bg-gray-100 text-gray-800 py-12 md:py-16 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            <span className="text-purple-600">Just</span> <span className="text-indigo-700">Vent</span> <span className="text-teal-500">It</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl font-semibold text-gray-600">Say what you feel. Let others listen...</p>
        </div>
      </header>
    );
  }