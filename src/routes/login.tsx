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
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F3F4F6] px-4">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Sample action route. Choose a role to open that shell.
            </CardDescription>
          </CardHeader>
          <Form method="post">
            <CardPanel className="space-y-4">
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
              </Field>
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <select
                  id="role"
                  name="role"
                  required
                  defaultValue=""
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/24"
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="students">Student (org submitter)</option>
                  <option value="signatories">Signatory</option>
                  <option value="admin">Admin (OSA)</option>
                </select>
              </Field>
              {actionData && "error" in actionData ? (
                <FieldError>{actionData.error}</FieldError>
              ) : null}
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
    </div>
  )
}
