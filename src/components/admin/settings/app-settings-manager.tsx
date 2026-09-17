"use client";

import Link from "next/link";
import { Alert, Button, Card, Col, Empty, Row, Spin, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { SectionTitle } from "@/components/admin/section-title";
import { F_BODY, F_HEAD, PP } from "@/lib/admin/theme";
import {
  useGetAllAboutQuery,
  useGetAllPrivacyQuery,
  useGetAllTermsQuery,
} from "@/redux/api/settingsApi";
import { getErrorMessage } from "@/utils/getErrorMessage";

function hasVisibleContent(html?: string) {
  if (!html) return false;
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0;
}

function LegalDocCard({
  title,
  href,
  icon,
  description,
  isLoading,
  isError,
  error,
  onRetry,
}: {
  title: string;
  href: string;
  icon: string;
  description?: string;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  const hasContent = hasVisibleContent(description);

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 16,
        border: `1.5px solid ${PP.border}`,
        height: "100%",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <Typography.Title
            level={5}
            style={{ fontFamily: F_HEAD, color: PP.headingPurple, margin: 0 }}
          >
            {icon} {title}
          </Typography.Title>
          <p
            className="text-xs mt-1 mb-0"
            style={{ color: PP.muted, fontFamily: F_BODY }}
          >
            Edit with the rich text editor
          </p>
        </div>
        <Link href={href}>
          <Button type="primary" icon={<EditOutlined />}>
            Edit
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : isError ? (
        <Alert
          type="error"
          showIcon
          title={getErrorMessage(error, "Failed to load")}
          action={
            <Button size="small" onClick={onRetry}>
              Retry
            </Button>
          }
        />
      ) : !hasContent ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No content yet"
        />
      ) : (
        <div
          className="legal-doc-preview text-sm"
          style={{
            color: "#4B5563",
            lineHeight: 1.6,
            maxHeight: 140,
            overflow: "hidden",
            position: "relative",
          }}
          dangerouslySetInnerHTML={{ __html: description || "" }}
        />
      )}
    </Card>
  );
}

export function AppSettingsManager() {
  const privacy = useGetAllPrivacyQuery();
  const terms = useGetAllTermsQuery();
  const about = useGetAllAboutQuery();

  return (
    <div>
      <SectionTitle>App Settings ⚙️</SectionTitle>
      <p
        className="text-sm mb-6"
        style={{ color: PP.muted, fontFamily: F_BODY, marginTop: -8 }}
      >
        Manage legal pages shown in the mobile app. Each document has its own
        editor.
      </p>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={8}>
          <LegalDocCard
            title="Privacy Policy"
            href="/admin/settings/privacy"
            icon="🛡️"
            description={privacy.data?.data?.description}
            isLoading={privacy.isLoading}
            isError={privacy.isError}
            error={privacy.error}
            onRetry={() => privacy.refetch()}
          />
        </Col>
        <Col xs={24} lg={8}>
          <LegalDocCard
            title="Terms & Conditions"
            href="/admin/settings/terms"
            icon="📜"
            description={terms.data?.data?.description}
            isLoading={terms.isLoading}
            isError={terms.isError}
            error={terms.error}
            onRetry={() => terms.refetch()}
          />
        </Col>
        <Col xs={24} lg={8}>
          <LegalDocCard
            title="About Us"
            href="/admin/settings/about"
            icon="ℹ️"
            description={about.data?.data?.description}
            isLoading={about.isLoading}
            isError={about.isError}
            error={about.error}
            onRetry={() => about.refetch()}
          />
        </Col>
      </Row>
    </div>
  );
}
