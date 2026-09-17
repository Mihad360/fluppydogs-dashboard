"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { AdminTableCard } from "@/components/admin/admin-table-card";
import { SectionTitle } from "@/components/admin/section-title";
import { useAppMessage } from "@/hooks/useAppMessage";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { formatApiDate } from "@/lib/admin/api-helpers";
import { F_BODY, F_HEAD, PP } from "@/lib/admin/theme";
import {
  useGetForwardEmailQuery,
  useGetSubmissionsQuery,
  useGetSubmissionsUnreadCountQuery,
  useMarkSubmissionReadMutation,
  useMarkSubmissionUnreadMutation,
  useUpdateForwardEmailMutation,
} from "@/redux/api/submissionsApi";
import type { ApiSubmission } from "@/types/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

function ForwardingEmailCard({ compact }: { compact?: boolean }) {
  const message = useAppMessage();
  const { data, isLoading } = useGetForwardEmailQuery();
  const [updateForwardEmail, { isLoading: saving }] =
    useUpdateForwardEmailMutation();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(data?.data?.forwardEmail || "");
  }, [data]);

  const onSave = async () => {
    try {
      await updateForwardEmail({ forwardEmail: value.trim() }).unwrap();
      message.success("Email saved!");
    } catch (err) {
      message.error(getErrorMessage(err, "Failed to save email"));
    }
  };

  const body = (
    <>
      <p
        className="text-xs font-medium mb-3"
        style={{ color: PP.muted, fontFamily: F_BODY }}
      >
        Submissions are auto-forwarded to this address.
      </p>
      {compact ? (
        <div className="flex gap-2 flex-wrap">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            style={{ flex: 1, minWidth: 200 }}
            disabled={isLoading}
          />
          <Button type="primary" loading={saving} onClick={onSave}>
            Save Email
          </Button>
        </div>
      ) : (
        <Space orientation="vertical" style={{ width: "100%" }}>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={isLoading}
          />
          <Button type="primary" loading={saving} onClick={onSave}>
            Save Email
          </Button>
        </Space>
      )}
    </>
  );

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 16,
        border: `1.5px solid ${PP.border}`,
        marginBottom: compact ? 16 : 0,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📧</span>
        <Typography.Title
          level={5}
          style={{ fontFamily: F_HEAD, color: PP.headingPurple, margin: 0 }}
        >
          Forwarding Email
        </Typography.Title>
      </div>
      {body}
    </Card>
  );
}

function SubmissionDetail({
  selected,
  onClose,
  onToggleRead,
}: {
  selected: ApiSubmission;
  onClose?: () => void;
  onToggleRead: () => void;
}) {
  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
            style={{ background: selected.color || PP.purple }}
          >
            {selected.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <Typography.Title level={5} style={{ margin: 0 }}>
              {selected.name}
            </Typography.Title>
            <Typography.Text type="secondary">
              {selected.email || "No email"}
            </Typography.Text>
            {selected.subject && (
              <p className="text-xs mb-0 mt-1" style={{ color: PP.muted }}>
                {selected.subject}
              </p>
            )}
          </div>
        </div>
        {onClose && (
          <Button
            type="text"
            icon={<span style={{ fontSize: 18 }}>×</span>}
            onClick={onClose}
          />
        )}
      </div>

      <div
        style={{
          background: "#FAF0FF",
          padding: 16,
          borderRadius: 12,
          border: `1.5px solid ${PP.borderSoft}`,
          marginBottom: 16,
        }}
      >
        {selected.message}
      </div>

      <div className="flex items-center justify-between">
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Received: {formatApiDate(selected.createdAt)}
        </Typography.Text>
        <Button type="link" onClick={onToggleRead}>
          {selected.isRead ? "Mark unread" : "Mark read"}
        </Button>
      </div>
    </>
  );
}

export function SubmissionsManager() {
  const message = useAppMessage();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSubmissionsQuery({ limit: 50, sort: "-createdAt" });
  const { data: unreadData } = useGetSubmissionsUnreadCountQuery();
  const [markReadMutation] = useMarkSubmissionReadMutation();
  const [markUnreadMutation] = useMarkSubmissionUnreadMutation();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ApiSubmission | null>(null);
  const { isMobile, isTablet } = useBreakpoint();
  const showSidePanel = !isMobile && !isTablet;

  const submissions = useMemo(() => data?.data ?? [], [data]);
  const unreadCount = unreadData?.data?.count ?? 0;

  const filtered = submissions.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q) ||
      (item.subject || "").toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q)
    );
  });

  const markRead = async (id: string, shouldBeRead: boolean) => {
    try {
      if (shouldBeRead) {
        await markReadMutation(id).unwrap();
      } else {
        await markUnreadMutation(id).unwrap();
      }
      setSelected((current) =>
        current && current._id === id
          ? { ...current, isRead: shouldBeRead }
          : current,
      );
    } catch (err) {
      message.error(getErrorMessage(err, "Failed to update submission"));
    }
  };

  const openSubmission = (item: ApiSubmission) => {
    setSelected(item);
    if (!item.isRead) void markRead(item._id, true);
  };

  const columns: ColumnsType<ApiSubmission> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {!record.isRead && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: PP.pink }}
            />
          )}
          <span
            style={{
              fontWeight: !record.isRead ? "bold" : "normal",
              color: PP.ink,
            }}
          >
            {record.name}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record.email || "—",
    },
    { title: "Message", dataIndex: "message", key: "message", ellipsis: true },
    {
      title: "Date",
      key: "date",
      render: (_, record) => formatApiDate(record.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          onClick={(event) => {
            event.stopPropagation();
            void markRead(record._id, !record.isRead);
          }}
        >
          {record.isRead ? "Mark unread" : "Mark read"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <SectionTitle>Contact Submissions 📬</SectionTitle>
          <p
            className="text-sm font-medium"
            style={{ color: PP.muted, fontFamily: F_BODY, marginTop: "-12px" }}
          >
            {unreadCount} unread submission{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          title={getErrorMessage(error, "Failed to load submissions")}
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {!showSidePanel && <ForwardingEmailCard compact />}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Input.Search
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{ marginBottom: 16 }}
              size="large"
            />

            {filtered.length === 0 ? (
              <Empty description="No submissions found" />
            ) : isMobile ? (
              <div className="flex flex-col gap-3">
                {filtered.map((sub) => (
                  <Card
                    key={sub._id}
                    variant="borderless"
                    style={{
                      borderRadius: 16,
                      border: !sub.isRead
                        ? `1.5px solid ${PP.purple}`
                        : `1.5px solid ${PP.borderSoft}`,
                      background: !sub.isRead ? "#FBF7FF" : "#fff",
                      cursor: "pointer",
                    }}
                    styles={{ body: { padding: 16 } }}
                    onClick={() => openSubmission(sub)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: sub.color || PP.purple }}
                      >
                        {sub.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className="font-semibold text-sm"
                            style={{ color: PP.ink }}
                          >
                            {sub.name}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!sub.isRead && (
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: PP.pink }}
                              />
                            )}
                            <span className="text-xs" style={{ color: PP.gray }}>
                              {formatApiDate(sub.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
                          {sub.email || "No email"}
                        </p>
                        <p
                          className="text-sm mb-0"
                          style={{ color: "#4B5563", lineHeight: 1.5 }}
                        >
                          {sub.message}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <AdminTableCard>
                <Table
                  dataSource={filtered}
                  columns={columns}
                  rowKey="_id"
                  pagination={{ pageSize: 6 }}
                  scroll={{ x: 650 }}
                  onRow={(record) => ({
                    onClick: () => openSubmission(record),
                    style: {
                      cursor: "pointer",
                      background: !record.isRead ? "#FBF7FF" : "#fff",
                    },
                  })}
                />
              </AdminTableCard>
            )}
          </Col>

          {showSidePanel && (
            <Col lg={8}>
              <Space orientation="vertical" style={{ width: "100%" }} size="large">
                <ForwardingEmailCard />
                {selected && (
                  <Card
                    variant="borderless"
                    style={{
                      borderRadius: 16,
                      border: `1.5px solid ${PP.purple}`,
                      boxShadow: "0 8px 30px rgba(168,85,247,0.15)",
                    }}
                  >
                    <SubmissionDetail
                      selected={selected}
                      onClose={() => setSelected(null)}
                      onToggleRead={() =>
                        void markRead(selected._id, !selected.isRead)
                      }
                    />
                  </Card>
                )}
              </Space>
            </Col>
          )}
        </Row>
      )}

      {!showSidePanel && selected && (
        <Modal
          title={null}
          open={!!selected}
          onCancel={() => setSelected(null)}
          footer={null}
          width={isMobile ? "95vw" : 520}
          centered
        >
          <SubmissionDetail
            selected={selected}
            onToggleRead={() => void markRead(selected._id, !selected.isRead)}
          />
        </Modal>
      )}
    </div>
  );
}
