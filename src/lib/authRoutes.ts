/** Auth screens that use the Figma full-page layout instead of the site chrome. */
export const FULL_BLEED_AUTH_ROUTES = ["/auth/role", "/auth/provider/login", "/auth/landing"] as const;

export function isFullBleedAuthRoute(pathname: string) {
    return FULL_BLEED_AUTH_ROUTES.some((route) => pathname === route);
}
