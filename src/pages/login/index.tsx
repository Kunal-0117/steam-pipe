import { Link } from "react-router-dom";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 overflow-x-hidden scrollbar-hide">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div
          className="flex justify-center gap-2 md:justify-start"
          data-aos="fade-down"
        >
          <Link
            to="/"
            className="font-bold text-lg flex items-start justify-center gap-3"
          >
            <img src="/logo.png" className="size-12 block" />
            <div>
              Greenbox Telemetry
              <p className="text-[.625rem] text-muted-foreground absolute">
                Feasibility & Quotation Engineer
              </p>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div
            className="w-full max-w-xs"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <LoginForm />
          </div>
        </div>
      </div>
      <div
        className="bg-muted relative hidden lg:block"
        data-aos="fade-left"
        data-aos-delay="200"
      >
        <img
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] "
        />
      </div>
    </div>
  );
}
