import '../../styles/loading.scss';
import Image from 'next/image';

export default function Erroring() {
  return (
    <div className="loading">
        <Image src="/icon2.png" alt="loading" width={150} height={150} priority/>
        <p>Experiencing errors... </p>
    </div>
  );
}