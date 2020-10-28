export interface SearchedUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string | null;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}

export interface SearchResults {
  total_count: number;
  incomplete_results: boolean;
  items: SearchedUser[];
}

interface Core {
  limit: number;
  remaining: number;
  reset: number;
}

interface Search {
  limit: number;
  remaining: number;
  reset: number;
}

interface Graphql {
  limit: number;
  remaining: number;
  reset: number;
}

interface IntegrationManifest {
  limit: number;
  remaining: number;
  reset: number;
}

interface CodeScanningUpload {
  limit: number;
  remaining: number;
  reset: number;
}

interface Resources {
  core: Core;
  search: Search;
  graphql: Graphql;
  integration_manifest: IntegrationManifest;
  code_scanning_upload: CodeScanningUpload;
}

interface Rate {
  limit: number;
  remaining: number;
  reset: number;
}

export interface RateLimitResponse {
  resources: Resources;
  rate: Rate;
}
