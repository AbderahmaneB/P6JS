import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/dashboard" className={className}>
      <Image
        src="/logo-sportsee.png"
        alt="SportSee"
        width={120}
        height={12}
        priority
      />
    </Link>
  );
}
