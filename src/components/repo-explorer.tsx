"use client";

import { useMemo, useState } from "react";
import type { GitHubRepo } from "@/lib/github";

type RepoExplorerProps = {
  repos: GitHubRepo[];
};

type SortKey = "updated" | "stars" | "forks" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "updated", label: "最近更新" },
  { value: "stars", label: "Stars 最多" },
  { value: "forks", label: "Forks 最多" },
  { value: "name", label: "项目名称" },
];

export function RepoExplorer({ repos }: RepoExplorerProps) {
  const [language, setLanguage] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("updated");

  const languages = useMemo(() => {
    const uniqueLanguages = new Set(repos.map((repo) => repo.language).filter(Boolean));
    return ["all", ...Array.from(uniqueLanguages).sort()] as string[];
  }, [repos]);

  const filteredRepos = useMemo(() => {
    return repos
      .filter((repo) => language === "all" || repo.language === language)
      .sort((first, second) => {
        if (sortKey === "stars") {
          return second.stargazersCount - first.stargazersCount;
        }

        if (sortKey === "forks") {
          return second.forksCount - first.forksCount;
        }

        if (sortKey === "name") {
          return first.name.localeCompare(second.name);
        }

        return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();
      });
  }, [language, repos, sortKey]);

  if (repos.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/6 p-8 text-center backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-white">暂无公开仓库</h2>
        <p className="mt-3 text-slate-300">这个账号目前没有可以展示的公开项目。</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">公开项目</h2>
          <p className="mt-1 text-sm text-slate-400">
            当前展示 {filteredRepos.length} / {repos.length} 个仓库
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            编程语言
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/70"
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "全部语言" : item}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            排序方式
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/70"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredRepos.map((repo) => (
          <article
            key={repo.id}
            className="group flex min-h-72 flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.36)] transition hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-slate-900/80"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white transition group-hover:text-cyan-100">{repo.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{repo.fullName}</p>
              </div>
              {repo.archived ? (
                <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs text-amber-100">
                  archived
                </span>
              ) : null}
            </div>

            <p className="mt-5 flex-1 leading-7 text-slate-300">
              {repo.description || "这个项目暂时没有填写描述，可以后续在 GitHub README 中补充亮点。"}
            </p>

            {repo.topics.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {repo.topics.slice(0, 5).map((topic) => (
                  <span key={topic} className="rounded-full bg-white/8 px-3 py-1 text-xs text-slate-300">
                    {topic}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4">
              <RepoMetric label="语言" value={repo.language ?? "Other"} />
              <RepoMetric label="Stars" value={repo.stargazersCount.toString()} />
              <RepoMetric label="Forks" value={repo.forksCount.toString()} />
              <RepoMetric label="更新" value={formatDate(repo.updatedAt)} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
              >
                View on GitHub
              </a>
              {repo.homepage ? (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-200/50 hover:text-cyan-100"
                >
                  Live Demo
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RepoMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
