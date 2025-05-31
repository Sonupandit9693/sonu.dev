import Link from "next/link";
import React from "react";
import Particles from "./components/particles";
import About from "./components/about";

const navigation = [
  { name: "Experience", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "Skills", href: "/skills" },
  { name: "Blog", href: "/blogs" },
  { name: "Contact", href: "/contact" },
  { name: "Resume", href: "/resume" },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-tl from-black via-zinc-600/20 to-black min-h-screen w-full overflow-hidden">
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <nav className="my-16 animate-fade-in">
          <ul className="flex items-center justify-center gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
              >
                {item.name}
              </Link>
            ))}
          </ul>
        </nav>

        <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={100}
        />
        <h1 className="py-3.5 px-0.5 z-10 text-2xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
          sonu.dev
        </h1>
        <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />

        <div className="my-16 text-center animate-fade-in">
          <h2 className="text-sm text-zinc-500">
            Software Development Engineer @{" "}
            <Link
              target="_blank"
              href="https://www.cyfuture.com/"
              className="underline duration-500 hover:text-zinc-300"
            >
              Cyfuture India Pvt Ltd
            </Link>
            <br />
            <span className="text-zinc-400">
              Building innovative solutions with a focus on quality and performance.
            </span>
            <br />
            {/* Uncomment the line below to add a link to unkey.dev */} 
            {/* <Link
              target="_blank"
              href="https://unkey.dev"
              className="underline duration-500 hover:text-zinc-300"
            >
              unkey.dev
            </Link>{" "} */}

          </h2>
        </div>
      </div>

      {/* About Me Section */}
      <About/>
        

      <div className="w-full h-16 flex items-center justify-center text-sm text-zinc-500">
        <p className="text-center">
          © {new Date().getFullYear()} Sonu Kumar. All rights reserved.
        </p>
      </div>
    </div>
  );
}
