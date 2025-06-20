import Link from 'next/link';
import { Spotlight } from '@/components/ui/Spotlight';
import MagicButton from '@/components/MagicButton';
import { FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black-100 flex justify-center items-center relative overflow-hidden">
      {/* Spotlight Effects */}
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
      </div>

      {/* Grid Background */}
      <div className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2] absolute top-0 left-0 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="text-8xl mb-8">💸</div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Page Not Found
        </h2>
        <p className="text-white-100 mb-8 max-w-md">
          Looks like this expense couldn&apos;t be tracked. Let&apos;s get you back to managing your finances.
        </p>
        <Link href="/">
          <MagicButton
            title="Back to Home"
            icon={<FaHome />}
            position="right"
            otherClasses="!bg-gradient-to-r from-purple/20 to-blue-500/20 hover:from-purple/30 hover:to-blue-500/30"
          />
        </Link>
      </div>
    </div>
  );
} 