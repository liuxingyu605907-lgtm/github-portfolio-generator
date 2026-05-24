"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const usernamePattern = /^[a-zA-Z0-9-]{1,39}$/;

export function PortfolioSearch() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUsername = username.trim();

    if (!usernamePattern.test(nextUsername) || nextUsername.startsWith("-") || nextUsername.endsWith("-")) {
      setError("请输入有效的 GitHub 用户名，例如 octocat、vercel。");
      return;
    }

    setError("");
    router.push(`/u/${encodeURIComponent(nextUsername)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <label htmlFor="github-username" className="sr-only">
          GitHub 用户名
        </label>
        <input
          id="github-username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="输入 GitHub 用户名，例如 octocat"
          className="h-13 w-full rounded-2xl border border-white/12 bg-white/8 px-5 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:bg-white/12"
        />
        {error ? <p className="mt-2 text-left text-sm text-rose-200">{error}</p> : null}
      </div>
      <button
        type="submit"
        className="h-13 rounded-2xl bg-cyan-300 px-7 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
      >
        生成作品集
      </button>
    </form>
  );
}
