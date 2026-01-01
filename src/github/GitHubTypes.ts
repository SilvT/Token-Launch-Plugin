/**
 * Token Launch - Figma Plugin for Design Token Automation
 * Copyright (c) 2026 Silvia Travieso
 * Licensed under the MIT License
 *
 * GitHub Integration Types for Figma Plugin
 *
 * Defines interfaces for GitHub API integration, authentication,
 * and repository management within Figma's plugin environment.
 */

// =============================================================================
// AUTHENTICATION TYPES
// =============================================================================

export interface GitHubCredentials {
  token: string;
  username?: string;  // Optional, can be fetched from API
}

export interface GitHubConfig {
  credentials: GitHubCredentials;
  repository: {
    owner: string;
    name: string;
    branch?: string;  // Default to 'main'
  };
  paths: {
    rawTokens: string;     // e.g., 'raw/figma-export.json'
    processedTokens: string; // e.g., 'tokens/'
  };
  commitMessage?: string;  // Template for commit messages
}

export interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    type: string;
  };
  private: boolean;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  default_branch: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface GitHubApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface GitHubError {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    resource: string;
    field: string;
    code: string;
  }>;
}

export interface ConnectionTestResult {
  success: boolean;
  user?: GitHubUser;
  repository?: GitHubRepository;
  error?: string;
  permissions?: {
    canRead: boolean;
    canWrite: boolean;
    canAdmin: boolean;
  };
}

// =============================================================================
// FILE OPERATIONS
// =============================================================================

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  content?: string;  // Base64 encoded
  encoding?: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
}

export interface CreateFileRequest {
  message: string;
  content: string;  // Base64 encoded
  branch?: string;
  committer?: {
    name: string;
    email: string;
  };
  author?: {
    name: string;
    email: string;
  };
}

export interface UpdateFileRequest extends CreateFileRequest {
  sha: string;  // Required for updates
}

// =============================================================================
// BOUND CLIENT INTERFACE
// =============================================================================

/**
 * Interface for bound GitHub client with methods that maintain proper context
 */
export interface BoundGitHubClient {
  // File operations
  fileExists(owner: string, repo: string, path: string): Promise<boolean>;
  createFile(owner: string, repo: string, path: string, request: CreateFileRequest): Promise<{ content: GitHubFile; commit: any }>;
  updateFile(owner: string, repo: string, path: string, request: UpdateFileRequest): Promise<{ content: GitHubFile; commit: any }>;
  getFile(owner: string, repo: string, path: string): Promise<GitHubFile>;

  // Repository operations
  getRepository(owner: string, repo: string): Promise<GitHubRepository>;
  testConnection(config: { owner: string; name: string }): Promise<ConnectionTestResult>;
  getUser(): Promise<GitHubUser>;
}

// =============================================================================
// CONFIGURATION STATE
// =============================================================================

export interface GitHubConfigState {
  isConfigured: boolean;
  isConnected: boolean;
  lastTestResult?: ConnectionTestResult;
  config?: GitHubConfig;
  errors: string[];
}

export type GitHubConnectionStatus =
  | 'not-configured'
  | 'testing'
  | 'connected'
  | 'error'
  | 'invalid-token'
  | 'repository-not-found'
  | 'insufficient-permissions';

// =============================================================================
// GITHUB ACTIONS WORKFLOW INTEGRATION
// =============================================================================

export interface WorkflowTriggerConfig {
  enabled: boolean;           // Whether to trigger workflow
  workflowFileName: string;   // e.g., 'transform-tokens.yml'
  inputs?: Record<string, string>; // Optional workflow inputs
}

export interface WorkflowTriggerResult {
  triggered: boolean;
  success?: boolean;
  error?: string;
  workflowUrl?: string; // Link to Actions page
}

// =============================================================================
// PLUGIN INTEGRATION
// =============================================================================

export interface TokenPushRequest {
  tokens: any;  // The extracted token data
  config: GitHubConfig;
  options?: {
    createPullRequest?: boolean;
    branchName?: string;
    commitMessage?: string;
    workflowTrigger?: WorkflowTriggerConfig;  // NEW: Optional workflow trigger
  };
}

export interface TokenPushResult {
  success: boolean;
  commitSha?: string;
  pullRequestUrl?: string;
  error?: string;
  filesCreated: string[];
  filesUpdated: string[];
  workflowTrigger?: WorkflowTriggerResult;  // NEW: Workflow trigger result
}