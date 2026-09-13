import { Link, useLoaderData } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { HomeLoader } from "@/routes/home.loader"
import { useSessionStore } from "@/stores/session-store"

export function Home() {
  const data = useLoaderData<HomeLoader>()
  const name = useSessionStore((state) => state.name)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Project ready</CardTitle>
          <CardDescription>{data.message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{name ? `Hello, ${name}` : "Guest"}</Badge>
            <p className="font-mono text-xs text-muted-foreground">
              {data.loadedAt}
            </p>
          </div>
          {name ? null : (
            <Button render={<Link to="/login" />} size="sm">
              Go to login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
