import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MeteorBackground } from "@/components/meteor-background";
import { RepoExplorer } from "@/components/repo-explorer";
import { getGitHubRepos, getGitHubUser, GitHubApiError } from "@/lib/github";
import type { GitHubRepo, GitHubUser } from "@/lib/github";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username} | GitHub Portfolio`,
    description: `自动生成的 ${username} GitHub 项目展示页。`,
  };
}

export default async function UserPortfolioPage({ params }: PageProps) {
  const { username } = await params;
  let user: GitHubUser | null = null;
  let repos: GitHubRepo[] = [];
  let hasRequestError = false;

  try {
    [user, repos] = await Promise.all([getGitHubUser(username), getGitHubRepos(username)]);
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      notFound();
    }

    hasRequestError = true;
  }

  if (hasRequestError || !user) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 text-center">
        <MeteorBackground />
        <section className="relative z-10 max-w-xl rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-200">GitHub API Error</p>
          <h1 className="mt-4 text-3xl font-black text-white">暂时无法加载这个作品集</h1>
          <p className="mt-4 leading-7 text-slate-300">
            可能是 GitHub API 限流或网络请求失败。稍后重试，或者换一个用户名查看示例。
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
          >
            返回首页
          </Link>
        </section>
      </div>
    );
  }

  const activeRepos = repos.filter((repo) => !repo.archived).length;
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazersCount, 0);
  const languages = new Set(repos.map((repo) => repo.language).filter(Boolean)).size;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950">
      <MeteorBackground />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
        <nav className="mb-10 flex items-center justify-between rounded-full border border-white/10 bg-slate-950/45 px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="text-sm font-black tracking-[0.24em] text-cyan-100">
            GITHUB PORTFOLIO
          </Link>
          <a
            href={user.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            打开 GitHub
          </a>
        </nav>

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_90px_rgba(2,6,23,0.5)] backdrop-blur-xl md:grid-cols-[auto_1fr] md:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl}
            alt={`${user.login} avatar`}
            className="h-28 w-28 rounded-3xl object-cover ring-2 ring-cyan-200/30 md:h-36 md:w-36"
          />
          <div>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">@{user.login}</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
                  {user.name ?? user.login}
                </h1>
                <p className="mt-4 max-w-2xl leading-8 text-slate-300">
                  {user.bio ?? "这个开发者暂时没有填写 GitHub bio，但公开仓库已经整理在下方。"}
                </p>
              </div>
              <a
                href={user.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
              >
                Follow on GitHub
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              {user.location ? <ProfileTag label="位置" value={user.location} /> : null}
              {user.company ? <ProfileTag label="组织" value={user.company} /> : null}
              {user.blog ? <ProfileLink href={user.blog} label="个人网站" /> : null}
            </div>
          </div>
        </section>

        <section className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="公开仓库" value={user.publicRepos.toString()} />
          <StatCard label="活跃项目" value={activeRepos.toString()} />
          <StatCard label="总 Stars" value={totalStars.toString()} />
          <StatCard label="技术语言" value={languages.toString()} />
          <StatCard label="Followers" value={user.followers.toString()} />
        </section>

        <RepoExplorer repos={repos} />
      </main>
    </div>
  );
}

function ProfileTag({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2">
      {label}: {value}
    </span>
  );
}

function ProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-cyan-100 transition hover:bg-cyan-200/15"
    >
      {label}
    </a>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}
