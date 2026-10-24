import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

/**
 * The logic below is a simple example, please make it more robust when implementing in your application.
 *
 * Reason: isAccessGranted is not validating the resource, since it is merging all roles. Two resources might
 * have the same role name and it makes sense to validate it more granular.
 */
const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles, keycloak } = authData;
  // inject() must run before the first await, while still in the injection context
  const router = inject(Router);

  const requiredRole = route.data['role'];
  console.log('requiredRole: '+requiredRole);
  if (!requiredRole) {
    return false;
  }

  const hasRequiredRole = (role: string): boolean =>
    Object.values(grantedRoles.resourceRoles).some((roles) => roles.includes(role));

  if (!authenticated) {
    await keycloak.login({ redirectUri: window.location.origin + state.url });
    return false;
  }

  if (hasRequiredRole(requiredRole)) {
    return true;
  }

  return router.parseUrl('/forbidden');
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);