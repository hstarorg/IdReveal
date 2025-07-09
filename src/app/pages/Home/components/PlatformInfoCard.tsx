import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Platforms } from '@/app/constants';
import { useAuth } from '@/app/hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type PlatformInfoCardProps = {
  platform: (typeof Platforms)[0];
};

export function PlatformInfoCard(props: PlatformInfoCardProps) {
  const { platform } = props;
  const { isLoading, error, userData, authenticate, logout } = useAuth();

  const handlePlatformAuth = async (platform: string) => {
    await authenticate(platform);
  };

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>
          <FontAwesomeIcon icon={platform.icon} /> {platform.label} Info
        </CardTitle>
        {/* <CardAction>act</CardAction> */}
      </CardHeader>
      <CardContent>{platform.desc}</CardContent>
      <CardFooter>
        <Button className="w-full" variant="default" onClick={() => handlePlatformAuth(platform.name)}>
          <FontAwesomeIcon icon={platform.icon} /> Connect to {platform.label}
        </Button>
      </CardFooter>
    </Card>
  );
}
