import { ThemeToggle } from "@/components/ThemeToggle";
import { PricingTable } from "@/services/clerk/components/PricingTable";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <>
      <SignInButton />
      <UserButton />
      <ThemeToggle />
      <PricingTable />
    </>
  );
}
