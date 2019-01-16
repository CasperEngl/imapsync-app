import { platform } from 'os';

export type Platform = 'aix' | 'freebsd' | 'linux' | 'openbsd' | 'android' | 'linux' | 'darwin' | 'sunos' | 'mac' | 'win32' | 'win' | 'Unknown OS';

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