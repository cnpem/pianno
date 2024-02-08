import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GithubIcon, LibraryIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function HeroSection() {
  return (
    <section className="container relative flex flex-col justify-center gap-8 xl:h-[calc(100vh-4rem)] xl:flex-row items-center">
      <aside className="relative my-4 xl:my-16 xl:flex-1">
        <Image
          className="dark:hidden"
          src="/uwu/hero.svg"
          alt="pianno"
          width={500}
          height={500}
        />
        <Image
          className="dark:block hidden"
          src="/uwu/hero-dark.svg"
          alt="pianno-dark"
          width={500}
          height={500}
        />
      </aside>
      <aside className="my-16 flex flex-col items-center self-center xl:my-24 xl:-mr-10 xl:ml-10 xl:flex-1 xl:items-start">
        <p className="my-8 text-center text-2xl md:text-4xl xl:text-left">
          <span
            className="font-black text-transparent
        bg-clip-text bg-gradient-to-b
        from-fuchsia-900 to-fuchsia-500
        dark:from-fuchsia-600 dark:to-fuchsia-200"
          >
            pianno
          </span>
          <br />A simple tool to annotate pimega images.
        </p>
        <nav className="flex flex-wrap gap-4">
          <Link
            href="/docs/user"
            className={cn(
              buttonVariants({
                size: "lg",
              }),
              "text-md w-full rounded-full sm:w-auto"
            )}
          >
            <LibraryIcon className="mr-2 inline-block" size={20} />
            Documentation
          </Link>
          <a
            href="https://github.com/cnpem/pianno"
            className={cn(
              buttonVariants({
                size: "lg",
                variant: "link",
              }),
              "text-md w-full rounded-full sm:w-auto"
            )}
          >
            <GithubIcon className="-ml-1 mr-2 inline-block" size={20} />
            GitHub
          </a>
        </nav>
      </aside>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col justify-center text-center">
      <HeroSection />
    </main>
  );
}
