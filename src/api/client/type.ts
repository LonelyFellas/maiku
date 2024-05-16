export interface GetReleaseResult {
  id: number;
  version: string;
  description: string;
  created_at: string;
}
export interface PostUpgradeRelease {
  id: number;
  description: string;
}
