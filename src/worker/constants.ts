export const Platform = {
  Google: 'google',
  X: 'x',
} as const;
export type PlatformValues = ValuesOf<typeof Platform>;

type ValuesOf<T> = T[keyof T];
