import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TaskDetailLoading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Skeleton className="h-9 w-40 mb-6" />

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-6" />

          <Separator className="my-4" />

          <div className="flex gap-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
