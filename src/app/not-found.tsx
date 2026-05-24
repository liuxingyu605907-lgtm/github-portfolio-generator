import Link from "next/link";
import { MeteorBackground } from "@/components/meteor-background";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 text-center">
      <MeteorBackground />
      <section className="relative z-10 max-w-xl rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">Not Found</p>
        <h1 className="mt-4 text-3xl font-black text-white">没有找到这个 GitHub 用户</h1>
        <p className="mt-4 leading-7 text-slate-300">请检查用户名是否拼写正确，或者回到首页输入另一个账号。</p>
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
