import '../../styles/loading.scss';
import Image from 'next/image';

export function Loading() {
  return (
    <div className="loading">
        <Image src="/icon2.png" alt="loading" width={150} height={150} />
        <p>Loading... </p>
    </div>
  );
}