'use client'
// import { getUserSession } from '@/app/lib/session'
import GoogleLoginButton from "@/app/components/GoogleLoginButton";

export default function Home() {
    // const user = await getUserSession()
    // return <main className="">{JSON.stringify(user)}</main>

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome</h1>
        <GoogleLoginButton />
    </main>
  );
}