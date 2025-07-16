export interface GitHubWebhookBase {
  action: string;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      id: number;
    };
    url?: string;
    html_url?: string;
    git_url?: string;
  };
  sender: {
    login: string;
    id: number;
  };
}

export interface PushEventPayload extends GitHubWebhookBase {
  ref: string;
  commits: Array<{
    id: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
  }>;
}

export interface PullRequestEventPayload extends GitHubWebhookBase {
  pull_request: {
    id: number;
    number: number;
    title: string;
    state: string;
    user: {
      login: string;
      id: number;
    };
    body: string;
  };
}

export interface PullRequestWebhookPayload {
  action: "opened" | "synchronize" | "reopened" | "closed";
  number: number;
  pull_request: {
    id: number;
    number: number;
    title: string;
    body: string;
    user: {
      login: string;
    };
    head: {
      sha: string;
      ref: string;
    };
    base: {
      sha: string;
      ref: string;
    };
    diff_url: string;
    patch_url: string;
    commits_url: string;
    review_comments_url: string;
    _links: {
      diff: { href: string };
      patch: { href: string };
    };
  };
  repository: {
    name: string;
    full_name: string;
    owner: {
      login: string;
    };
    clone_url: string;
  };
}

// Union type for different webhook payloads
export type GitHubWebhookPayload = PushEventPayload | PullRequestEventPayload;
