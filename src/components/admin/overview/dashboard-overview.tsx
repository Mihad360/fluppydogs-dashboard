"use client";

import Link from "next/link";
import { Alert, Button, Card, Col, Empty, Row, Spin, Statistic, Tag, Typography } from "antd";
import { BrandMark } from "@/components/admin/brand-mark";
import { SectionTitle } from "@/components/admin/section-title";
import {
  formatApiDate,
  getBrandLogoUrl,
  getPostBrand,
} from "@/lib/admin/api-helpers";
import { F_BODY, F_HEAD, PP } from "@/lib/admin/theme";
import { useGetOverviewQuery } from "@/redux/api/dashboardApi";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function DashboardOverview() {
  const { data, isLoading, isError, error, refetch } = useGetOverviewQuery();
  const overview = data?.data;
  const stats = overview?.stats;
  const latestPosts = overview?.latestPosts ?? [];
  const recentSubmissions = overview?.recentSubmissions ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        title={getErrorMessage(error, "Failed to load dashboard")}
        action={
          <Button size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <SectionTitle>Dashboard 👋</SectionTitle>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 16,
              boxShadow: PP.cardShadow,
              border: `1.5px solid ${PP.purple}22`,
            }}
          >
            <Statistic
              title={
                <span
                  style={{
                    color: PP.muted,
                    fontFamily: F_BODY,
                    textTransform: "uppercase",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Posts this month
                </span>
              }
              value={stats?.postsThisMonth ?? 0}
              prefix="📣"
              styles={{ content: { fontFamily: F_HEAD, color: PP.ink } }}
            />
            <div style={{ color: PP.gray, fontSize: 12, marginTop: 4 }}>
              {stats?.publishedPosts ?? 0} live across all brands
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 16,
              boxShadow: PP.cardShadow,
              border: `1.5px solid ${PP.pink}22`,
            }}
          >
            <Statistic
              title={
                <span
                  style={{
                    color: PP.muted,
                    fontFamily: F_BODY,
                    textTransform: "uppercase",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  New Submissions
                </span>
              }
              value={stats?.unreadSubmissions ?? 0}
              prefix="📬"
              styles={{ content: { fontFamily: F_HEAD, color: PP.ink } }}
            />
            <div style={{ color: PP.gray, fontSize: 12, marginTop: 4 }}>
              need your review
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 16,
              boxShadow: PP.cardShadow,
              border: `1.5px solid ${PP.green}33`,
            }}
          >
            <Statistic
              title={
                <span
                  style={{
                    color: PP.muted,
                    fontFamily: F_BODY,
                    textTransform: "uppercase",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Push devices
                </span>
              }
              value={stats?.pushReadyDevices ?? 0}
              prefix="📱"
              styles={{ content: { fontFamily: F_HEAD, color: PP.ink } }}
            />
            <div style={{ color: PP.gray, fontSize: 12, marginTop: 4 }}>
              phones that will get live post alerts
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Typography.Text
            strong
            style={{
              color: PP.muted,
              textTransform: "uppercase",
              fontSize: 12,
              letterSpacing: 1,
              display: "block",
              marginBottom: 12,
            }}
          >
            Latest Posts
          </Typography.Text>
          <div className="flex flex-col gap-3">
            {latestPosts.length === 0 ? (
              <Empty description="No posts yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              latestPosts.map((post) => {
                const brand = getPostBrand(post);
                return (
                  <Link key={post._id} href="/admin/posts" className="no-underline">
                    <Card
                      styles={{ body: { padding: 12 } }}
                      style={{
                        borderRadius: 16,
                        border: `1.5px solid ${brand?.accent || PP.purple}22`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <BrandMark
                          src={getBrandLogoUrl(brand)}
                          alt={brand?.name || "Brand"}
                          tint={brand?.bgTint}
                          className="w-9 h-9 rounded-xl flex-shrink-0 p-1"
                          imgClassName="w-full h-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold truncate mb-0"
                            style={{ color: PP.ink }}
                          >
                            {post.title}
                          </p>
                          <p className="text-xs mb-0" style={{ color: PP.gray }}>
                            {formatApiDate(post.publishedAt || post.createdAt)}
                          </p>
                        </div>
                        <Tag
                          color={post.published ? brand?.accent || PP.purple : "default"}
                          style={{ borderRadius: 12, border: 0 }}
                        >
                          {post.published ? "Live" : "Draft"}
                        </Tag>
                      </div>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <Typography.Text
            strong
            style={{
              color: PP.muted,
              textTransform: "uppercase",
              fontSize: 12,
              letterSpacing: 1,
              display: "block",
              marginBottom: 12,
            }}
          >
            Recent Submissions
          </Typography.Text>
          <div className="flex flex-col gap-3">
            {recentSubmissions.length === 0 ? (
              <Empty
                description="No submissions yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              recentSubmissions.map((sub) => (
                <Link
                  key={sub._id}
                  href="/admin/submissions"
                  className="no-underline"
                >
                  <Card
                    styles={{ body: { padding: 12 } }}
                    style={{
                      borderRadius: 16,
                      border: `1.5px solid ${PP.borderSoft}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: sub.color || PP.purple }}
                      >
                        {sub.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold mb-0"
                          style={{ color: PP.ink }}
                        >
                          {sub.name}
                        </p>
                        <p
                          className="text-xs truncate mb-0"
                          style={{ color: PP.gray }}
                        >
                          {sub.message}
                        </p>
                      </div>
                      {!sub.isRead && (
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: PP.pink }}
                        />
                      )}
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
