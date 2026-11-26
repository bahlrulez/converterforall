import { Metadata } from "next";
import { runFullSeoAudit } from "@/lib/seo";
import { AuditDashboardClient } from "./audit-dashboard-client";
import { getRobotsForPath } from "@/lib/seo-allowlist";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internal SEO Inventory & Audit | ConverterForAll Admin",
  description: "Internal technical SEO inventory audit and intelligence system. Not for public indexing.",
  robots: getRobotsForPath("/admin/seo-audit"),
};

export default function SeoAuditPage() {
  const auditData = runFullSeoAudit();

  return <AuditDashboardClient data={auditData} />;
}
