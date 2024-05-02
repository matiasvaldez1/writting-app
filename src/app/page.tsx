import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = auth();

  const user = await currentUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Test
    </ main>
  );
}
