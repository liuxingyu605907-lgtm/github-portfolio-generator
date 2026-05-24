import { MeteorBackground } from "@/components/meteor-background";
import { PortfolioSearch } from "@/components/portfolio-search";

const examples = ["liuxingyu605907-lgtm", "vercel", "microsoft"];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <MeteorBackground />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 md:px-8">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-slate-950/45 px-5 py-3 backdrop-blur-xl">
          <span className="text-sm font-black tracking-[0.24em] text-cyan-100">GITHUB PORTFOLIO</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            GitHub
          </a>
        </nav>

        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <p className="mb-5 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
            Portfolio Generator
          </p>
          <h1 className="max-w-4xl bg-gradient-to-br from-white via-cyan-100 to-slate-400 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl">
            输入 GitHub 用户名，生成你的项目展示页
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            自动拉取公开资料和仓库数据，整理成适合放进简历、作品集和面试展示的响应式页面。
          </p>
          <PortfolioSearch />

          <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
            {examples.map((example) => (
              <a
                key={example}
                href={`/u/${example}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-300 transition hover:border-cyan-200/50 hover:text-cyan-100"
              >
                查看示例：{example}
              </a>
            ))}
          </div>
        </section>

        <div className="grid gap-4 pb-10 md:grid-cols-3">
          {[
            ["自动收集", "读取头像、简介、关注数、仓库数量和公开项目数据。"],
            ["简历友好", "突出 stars、语言、更新时间和项目链接，方便面试官快速浏览。"],
            ["可继续扩展", "后续可以加入 AI 项目亮点生成、PDF 导出和自定义主题。"],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-3xl border border-white/10 bg-white/6 p-6 text-left shadow-[0_18px_60px_rgba(2,6,23,0.4)] backdrop-blur-xl"
            >
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
