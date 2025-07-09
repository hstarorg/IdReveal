import { Platforms } from '@/app/constants';
import { PlatformInfoCard } from './components/PlatformInfoCard';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Alert>
        <FontAwesomeIcon icon={faInfo} />
        <AlertDescription>
          ID Reveal helps you securely connect to various platforms and retrieve your identity information.
        </AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {Platforms.map((p) => (
          <PlatformInfoCard key={p.name} platform={p} />
        ))}
      </div>
    </div>
  );
}
