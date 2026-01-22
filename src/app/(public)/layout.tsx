import { getSystemConfig } from "@/lib/api/public";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { PublicLayoutWrapper } from "@/components/layout/public/PublicLayoutWrapper";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemConfig = await getSystemConfig("general");

  return (
    <PublicLayoutWrapper
      contactChannels={systemConfig?.contact_channels}
      header={<PublicHeader key="header" systemConfig={systemConfig} />}
      footer={<PublicFooter key="footer" systemConfig={systemConfig} />}
    >
      {children}
    </PublicLayoutWrapper>
  );
}




