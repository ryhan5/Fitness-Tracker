const Footer = () => {
  return (
    <footer className=" text-black mt-auto bg-gradient-to-t from-gray-400 to-gray-50 p-4 ">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Your App Name</h4>
            <p className="text-black">Your app description here.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-black hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="text-black hover:text-white transition-colors">About</a></li>
              <li><a href="/contact" className="text-black hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="text-black hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/privacy" className="text-black hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-black hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-black">&copy; 2024 Your App Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;