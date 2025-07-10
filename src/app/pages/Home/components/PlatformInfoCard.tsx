import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Platforms } from '@/app/constants';
import { PlatformName, useOAuthInfo } from '@/app/hooks/useOAuthInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type PlatformInfoCardProps = {
  platform: (typeof Platforms)[0];
};

export function PlatformInfoCard(props: PlatformInfoCardProps) {
  const { platform } = props;
  const {error, userData, connect, disconnect } = useOAuthInfo(props.platform.name as PlatformName);

  const isConnected = false;

  const handleButtonClick = isConnected ? disconnect : connect;

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>
          <FontAwesomeIcon icon={platform.icon} /> {platform.label} Info
        </CardTitle>
        {/* <CardAction>act</CardAction> */}
      </CardHeader>
      <CardContent>
        {platform.desc}
        {userData && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">User Data</h3>
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap break-all">{JSON.stringify(userData, null, 2)}</pre>
          </div>
        )}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="default" onClick={handleButtonClick}>
          {isConnected ? (
            'Disconnect'
          ) : (
            <>
              <FontAwesomeIcon icon={platform.icon} /> Connect to {platform.label}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
