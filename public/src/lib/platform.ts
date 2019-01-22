import { platform } from 'os';

export type Platform =
  | 'linux'
  | 'mac'
  | 'win'
  | 'Unknown OS';

export function getPlatform(): Platform {
  switch (platform()) {
    case 'aix':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'android':
      return 'linux';
    case 'darwin':
    case 'sunos':
      return 'mac';
    case 'win32':
      return 'win';

    default:
      return 'Unknown OS';
  }
}
