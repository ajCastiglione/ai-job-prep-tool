import { ReactNode } from "react";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  return <OriginalClerkProvider>{children}</OriginalClerkProvider>;
}
