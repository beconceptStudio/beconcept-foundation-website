import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { IUBENDA_COOKIE_POLICY_ID } from "@/lib/consent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("cookie");

export default function CookiePage() {
  return <LegalPage label="Cookie" title="Cookie policy" kind="cookie" policyId={IUBENDA_COOKIE_POLICY_ID} />;
}
