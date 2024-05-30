type Response = {
  commit: {
    committer: {
      date: string;
    };
  };
}[];

export interface GetGithubLastCommitOptions {
  /**
   * Repository name, like "fumadocs"
   */
  repo: string;

  /** Owner of repository */
  owner: string;

  /**
   * Path to file
   */
  path: string;

  /**
   * GitHub access token
   */
  token?: string;

  /**
   * Custom query parameters
   */
  params?: Record<string, string>;

  options?: RequestInit;
}

/**
 * Get the last edit time of a file
 *
 * The result is cached by default, you may specify revalidation period with [options](https://nextjs.org/docs/app/api-reference/functions/fetch#optionsnextrevalidate)
 */
export async function getGithubLastEdit({
  repo,
  token,
  owner,
  path,
  options = {},
  params: customParams = {},
}: GetGithubLastCommitOptions): Promise<Date | null> {
  const params = new URLSearchParams();
  const headers = new Headers(options.headers);
  params.set('path', path);
  params.set('page', '1');
  params.set('per_page', '1');

  for (const [key, value] of Object.entries(customParams)) {
    params.set(key, value);
  }

  if (token) {
    headers.append('authorization', token);
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?${params.toString()}`,
    {
      cache: 'force-cache',
      ...options,
      headers,
    },
  );

  if (!res.ok)
    throw new Error(
      `Failed to fetch last edit time from Git ${await res.text()}`,
    );
  const data = (await res.json()) as Response;

  if (data.length === 0) return null;
  return new Date(data[0].commit.committer.date);
}
