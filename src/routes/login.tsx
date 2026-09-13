import { Form, useActionData, useNavigation } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { LoginAction } from "@/routes/login.action"

export function Login() {
  const actionData = useActionData<LoginAction>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Sample action route. The name is stored in Zustand.
          </CardDescription>
        </CardHeader>
        <Form method="post">
          <CardPanel>
            <Field>
              <FieldLabel htmlFor="name">Display name</FieldLabel>
              <Input
                autoComplete="nickname"
                id="name"
                name="name"
                nativeInput
                placeholder="Your name"
                required
                type="text"
              />
              {actionData && "error" in actionData ? (
                <FieldError>{actionData.error}</FieldError>
              ) : null}
            </Field>
          </CardPanel>
          <CardFooter>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              type="submit"
            >
              Sign in
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  )
}
