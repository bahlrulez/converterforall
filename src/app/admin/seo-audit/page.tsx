import { Metadata } from "next";
import { runFullSeoAudit } from "@/lib/seo";
import { AuditDashboardClient } from "./audit-dashboard-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internal SEO Inventory & Audit | ConverterForAll Admin",
  description: "Internal technical SEO inventory audit and intelligence system. Not for public indexing.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SeoAuditPage() {
  const auditData = runFullSeoAudit();

  return <AuditDashboardClient data={auditData} />;
}
