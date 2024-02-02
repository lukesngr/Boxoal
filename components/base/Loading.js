import '../../styles/loading.scss';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="loading">
        <Image src="/icon2.png" alt="loading" width={150} height={150} priority/>
        <p>Loading... </p>
    </div>
  );
}