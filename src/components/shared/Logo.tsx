import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/admin" className="inline-block">
      <Image
        src="/brands/punkies.svg"
        alt="Punkies Playhouse"
        width={70}
        height={70}
        priority
      />
    </Link>
  );
};

export default Logo;
