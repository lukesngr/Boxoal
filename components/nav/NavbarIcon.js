import { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
export default function NavbarIcon() {
    const [hovered, setHovered] = useState(false);
    return (
        <Link href="/" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {hovered ? (<Image src="/icononhover.png" width={80} height={75} alt="BoxAlc Icon" priority></Image>) :
                (<Image src="/icon2.png" width={80} height={75} alt="BoxAlc Icon" priority></Image>)
            }
        </Link>
    )
}