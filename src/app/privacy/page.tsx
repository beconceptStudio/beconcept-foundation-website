import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { IUBENDA_PRIVACY_POLICY_ID } from "@/lib/consent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("privacy");

export default function PrivacyPage() {
  return <LegalPage label="Privacy" title="Informativa privacy" kind="privacy" policyId={IUBENDA_PRIVACY_POLICY_ID} />;
}
