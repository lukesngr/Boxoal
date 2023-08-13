import Image from 'next/image';

export default function UnSignedNav() {
    return (
        <nav class="navbar navbar-expand-lg">
            <Image src="icon.png" width={100} height={100} alt="BoxAlc Icon"></Image>
        </nav>
    )
}