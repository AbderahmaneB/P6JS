import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Image
        src="/logo-sportsee.png"
        alt="SportSee"
        width={120}
        height={12}
        priority
      />
    </div>
  );
}
