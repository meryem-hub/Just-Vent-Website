import React from 'react'

function Footer() {
  return (
    <footer className="bg-gradient-to-t from-white to-indigo-50 pt-20 pb-12">
    <div className="container mx-auto px-4 text-center">
      <div className="w-20 h-1 bg-gradient-to-r from-indigo-300 to-pink-300 mx-auto mb-8"></div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Just Vent</h3>
      <p className="text-gray-600 max-w-2xl mx-auto mb-8">
        A compassionate community for authentic sharing
      </p>
      <div className="flex justify-center space-x-6 mb-8">
        <a href="#" className="text-gray-500 hover:text-indigo-600">
          <TwitterIcon className="h-6 w-6"/>
        </a>
        <a href="#" className="text-gray-500 hover:text-pink-600">
          <InstagramIcon className="h-6 w-6"/>
        </a>
      </div>
      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()} Just Vent. All voices welcome.
      </p>
    </div>
  </footer>
  )
}

export default Footer
