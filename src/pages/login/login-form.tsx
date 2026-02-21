import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-provider";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const COGNITO_REGION = import.meta.env.VITE_COGNITO_REGION;
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

async function cognitoLogin(email: string, password: string) {
  const response = await fetch(
    `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  return data.AuthenticationResult;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = React.useState(false);
  const { setUser } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const authResult = await cognitoLogin(email, password);
      // Store the IdToken for API requests
      localStorage.setItem("id_token", authResult.IdToken);
      toast.success("Logged in successfully!");
      setUser({ email });
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col", className)}
      {...props}
    >
      <FieldGroup className="gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field data-aos="fade-up" data-aos-delay="50">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="Your Email"
            required
          />
        </Field>
        <Field data-aos="fade-up" data-aos-delay="100">
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            placeholder="Your Password"
            name="password"
            id="password"
            type="password"
            required
          />
        </Field>
        <Field data-aos="fade-up" className="-mt-2" data-aos-delay="150">
          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
