export type AccessRole = 'trial_user' | 'free_user' | 'premium_user';

type AccessRoleInput = {
  isGuestMode?: boolean;
  user?: {
    id?: string;
    plan?: 'trial' | 'free' | 'premium';
  } | null;
  profileUserRole?: string | null;
};

export function getAccessRole({ isGuestMode, user, profileUserRole }: AccessRoleInput): AccessRole {
  if (isGuestMode || user?.id?.startsWith('guest_') || user?.plan === 'trial') {
    return 'trial_user';
  }

  if (profileUserRole === 'premium_user' || user?.plan === 'premium') {
    return 'premium_user';
  }

  return 'free_user';
}

export function getDashboardBasePath(accessRole: AccessRole): string {
  return accessRole === 'trial_user' ? '/usuariostest/dashboard' : '/dashboard';
}

export function getDashboardPathForRole(input: AccessRoleInput, subPath = ''): string {
  const normalizedSubPath = subPath ? (subPath.startsWith('/') ? subPath : `/${subPath}`) : '';
  return `${getDashboardBasePath(getAccessRole(input))}${normalizedSubPath}`;
}

export function mapDashboardPath(pathname: string, targetRole: AccessRole): string {
  const currentBase = pathname.startsWith('/usuariostest/dashboard')
    ? '/usuariostest/dashboard'
    : '/dashboard';
  const targetBase = getDashboardBasePath(targetRole);
  const suffix = pathname.slice(currentBase.length);

  return `${targetBase}${suffix}` || targetBase;
}
