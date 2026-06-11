"use client";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] text-[#F5F5F0] py-20 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
          
          <div className="max-w-md">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">INDERASH<span className="text-[#FF6A3D]">.</span></h2>
            <p className="text-[#AAAAAA] text-lg">
              Creative Developer & AI Engineer. <br/>
              Building the next generation of intelligent web experiences.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <span className="label-mono text-[#666666]">Navigation</span>
              <a href="#home" className="hover:text-[#FF6A3D] transition-colors">Home</a>
              <a href="#about" className="hover:text-[#FF6A3D] transition-colors">About</a>
              <a href="#projects" className="hover:text-[#FF6A3D] transition-colors">Work</a>
            </div>
            
            <div className="flex flex-col gap-4">
              <span className="label-mono text-[#666666]">Socials</span>
              <a href="https://github.com/inderash18" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6A3D] transition-colors">GitHub</a>
              <a href="https://www.reddit.com/user/Conscious-Cake157/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6A3D] transition-colors">Reddit</a>
              <a href="mailto:inderash18@gmail.com" className="hover:text-[#FF6A3D] transition-colors">Email</a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#333333] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#666666] text-sm">
            © {currentYear} Inderash. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-[#AAAAAA] text-sm font-medium">Available for freelance</span>
          </div>
        </div>

      </div>

      {/* Massive Background Text */}
      <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 text-[15vw] font-black text-[#111111] pointer-events-none select-none tracking-tighter whitespace-nowrap z-0">
        INDERASH
      </div>
    </footer>
  );
}
