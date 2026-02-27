import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <span className="text-6xl">{"\u{1F63F}"}</span>
      <h1 className="text-4xl font-extrabold text-pink-500">404</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Oh no~ The page you&apos;re looking for doesn&apos;t exist!
      </p>
      <Link href="/dashboard">
        <Button className="rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 font-bold">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
