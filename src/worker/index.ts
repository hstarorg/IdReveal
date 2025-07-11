import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { showRoutes } from 'hono/dev';
import { getOAuthRedirectUrl, getUserInfo } from './bizs/oauth-biz';
import { Platform, PlatformValues } from './constants';
const app = new Hono<{ Bindings: Env }>();

function requireValidPlatform(platform: PlatformValues) {
  if (!([Platform.Google, Platform.X, Platform.Discord] as PlatformValues[]).includes(platform)) {
    throw new HTTPException(400, { message: 'Invalid platform name' });
  }
}

// return social OAuth redirect url
app.get('/api/connect/:platform', async (c) => {
  const platform = c.req.param('platform') as PlatformValues;
  requireValidPlatform(platform);

  const authorizeUrl = await getOAuthRedirectUrl(c.env, platform);
  return c.json({ authorizeUrl });
});

app.post('/api/connect/:platform', async (c) => {
  const platform = c.req.param('platform') as PlatformValues;
  requireValidPlatform(platform);

  const body = await c.req.json();
  const userInfo = await getUserInfo(c.env, platform, body.code as string);

  return c.json(userInfo);
});

showRoutes(app);

export default app;
