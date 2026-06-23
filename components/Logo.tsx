import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="https://res.cloudinary.com/dfwg5pbtd/image/upload/home-jabiye--protection-1-removebg-preview_zpk4jo.png"
      alt="Jabiye Home Protection"
      width={120}
      height={60}
      className={className}
      style={{ height: "48px", width: "auto" }}
    />
  );
}