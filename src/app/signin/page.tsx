import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-[#f7f5ef] px-5 py-16">
      <div className="w-full max-w-md border border-slate-900/10 bg-white p-8 text-center shadow-[8px_8px_0_#e7dfcf] sm:p-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-700">JesusBaby community</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Come write with us.</h1>
        <p className="mt-4 leading-7 text-slate-600">Sign in to read community reflections and share what God is doing in your life.</p>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/blog" });
          }}
        >
          <button className="w-full bg-slate-900 px-5 py-3 font-bold text-white transition-colors hover:bg-amber-600">
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}