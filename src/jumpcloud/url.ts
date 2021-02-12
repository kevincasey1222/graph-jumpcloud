export const consoleBaseUrl = "https://console.jumpcloud.com";

export function getConsoleUrl(path: string) {
  return `${consoleBaseUrl}${path}`;
}
