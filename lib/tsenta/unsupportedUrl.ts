const UNSUPPORTED_HOSTS = [
  "linkedin.com",
  "www.linkedin.com",
  "indeed.com",
  "www.indeed.com",
  "naukri.com",
  "www.naukri.com",
];

export function isClearlyUnsupportedApplyUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return UNSUPPORTED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return true;
  }
}
