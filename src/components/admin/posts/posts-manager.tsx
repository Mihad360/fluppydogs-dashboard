"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { AdminTableCard } from "@/components/admin/admin-table-card";
import { BrandMark } from "@/components/admin/brand-mark";
import { GradientButton } from "@/components/admin/gradient-button";
import { SectionTitle } from "@/components/admin/section-title";
import { useAppMessage } from "@/hooks/useAppMessage";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import {
  buildJsonFormData,
  formatApiDate,
  getBrandLogoUrl,
  getPostBrand,
  getPostImageUrl,
} from "@/lib/admin/api-helpers";
import { F_BODY, F_HEAD, PP } from "@/lib/admin/theme";
import { useGetBrandsQuery } from "@/redux/api/brandsApi";
import { useGetPostsQuery, useCreatePostMutation, useDeletePostMutation, useUpdatePostMutation } from "@/redux/api/postsApi";
import type { ApiPost } from "@/types/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface PostFormValues {
  brandId: string;
  title: string;
  body?: string;
  shortDescription?: string;
  published?: boolean;
}

export function PostsManager() {
  const message = useAppMessage();
  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
    error: postsErr,
    refetch: refetchPosts,
  } = useGetPostsQuery({ limit: 50, sort: "-createdAt" });
  const { data: brandsData, isLoading: brandsLoading } = useGetBrandsQuery({
    limit: 100,
    sort: "sortOrder",
  });

  const [createPost, { isLoading: creating }] = useCreatePostMutation();
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPost, setViewPost] = useState<ApiPost | null>(null);
  const [form] = Form.useForm<PostFormValues>();
  const [editId, setEditId] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<UploadFile[]>([]);
  const { isMobile } = useBreakpoint();
  const viewBrand = viewPost ? getPostBrand(viewPost) : null;
  const viewImageUrl = viewPost ? getPostImageUrl(viewPost) : "";

  const posts = useMemo(() => postsData?.data ?? [], [postsData]);
  const brands = useMemo(() => brandsData?.data ?? [], [brandsData]);
  const saving = creating || updating;
  const loading = postsLoading || brandsLoading;

  const openModal = (post?: ApiPost) => {
    setBannerFile([]);
    if (post) {
      const brand = getPostBrand(post);
      setEditId(post._id);
      form.setFieldsValue({
        brandId: brand?._id || (typeof post.brand === "string" ? post.brand : ""),
        title: post.title,
        body: post.body,
        shortDescription: post.shortDescription || undefined,
        published: post.published,
      });
    } else {
      setEditId(null);
      form.resetFields();
      form.setFieldsValue({
        brandId: brands[0]?._id,
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        brand: values.brandId,
        title: values.title,
        body: values.body ?? "",
        shortDescription: values.shortDescription || values.body || "",
        published: values.published ?? true,
      };
      const file = bannerFile[0]?.originFileObj as File | undefined;
      const formData = buildJsonFormData(payload, { banner: file });

      if (editId) {
        const result = await updatePost({ id: editId, data: formData }).unwrap();
        message.success(result.message || "Post updated");
      } else {
        const result = await createPost(formData).unwrap();
        message.success(result.message || "Post published");
      }
      setIsModalOpen(false);
      setBannerFile([]);
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error(getErrorMessage(err, "Failed to save post"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id).unwrap();
      message.success("Post deleted");
    } catch (err) {
      message.error(getErrorMessage(err, "Failed to delete post"));
    }
  };

  const columns: ColumnsType<ApiPost> = [
    {
      title: "Brand",
      key: "brand",
      render: (_, record) => {
        const brand = getPostBrand(record);
        return (
          <Space>
            <BrandMark
              src={getBrandLogoUrl(brand)}
              alt={brand?.name || "Brand"}
              tint={brand?.bgTint}
              className="w-8 h-8 rounded-lg p-1"
              imgClassName="w-full h-full"
            />
            <span style={{ color: brand?.accent || PP.purple, fontWeight: 600 }}>
              {brand?.name || "Unknown"}
            </span>
          </Space>
        );
      },
    },
    { title: "Title", dataIndex: "title", key: "title", width: 300, ellipsis: true },
    {
      title: "Date",
      key: "date",
      render: (_, record) =>
        formatApiDate(record.publishedAt || record.createdAt),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.published ? "green" : "orange"} style={{ border: 0 }}>
          {record.published ? "Live" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => setViewPost(record)}
          >
            View
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this post?"
            onConfirm={() => handleDelete(record._id)}
            okButtonProps={{ loading: deleting }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <SectionTitle>Updates & Posts 📣</SectionTitle>
        <GradientButton
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          disabled={!brands.length}
        >
          Add Post
        </GradientButton>
      </div>
      <p className="text-xs mb-4" style={{ color: PP.gray }}>
        Live posts are pushed to every phone that installed the app and allowed
        notifications. Drafts are not sent.
      </p>

      {postsError && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          title={getErrorMessage(postsErr, "Failed to load posts")}
          action={
            <Button size="small" onClick={() => refetchPosts()}>
              Retry
            </Button>
          }
        />
      )}

      {!brandsLoading && brands.length === 0 && (
        <Alert
          type="warning"
          showIcon
          className="mb-4"
          title="Create a brand before publishing posts."
        />
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : posts.length === 0 ? (
        <Empty description="No posts yet" />
      ) : isMobile ? (
        <div className="flex flex-col gap-3">
          {posts.map((post) => {
            const brand = getPostBrand(post);
            return (
              <Card
                key={post._id}
                variant="borderless"
                style={{
                  borderRadius: 16,
                  border: `1.5px solid ${brand?.accent || PP.purple}22`,
                }}
              >
                <div className="flex items-start gap-3">
                  <BrandMark
                    src={getBrandLogoUrl(brand)}
                    alt={brand?.name || "Brand"}
                    tint={brand?.bgTint}
                    className="w-10 h-10 rounded-xl flex-shrink-0 p-1"
                    imgClassName="w-full h-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        style={{
                          color: brand?.accent || PP.purple,
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {brand?.name || "Unknown"}
                      </span>
                      <Tag
                        color={post.published ? "green" : "orange"}
                        style={{ border: 0, margin: 0, fontSize: 11 }}
                      >
                        {post.published ? "Live" : "Draft"}
                      </Tag>
                    </div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: PP.ink, lineHeight: 1.4 }}
                    >
                      {post.title}
                    </p>
                    <p className="text-xs mb-2" style={{ color: PP.gray }}>
                      {formatApiDate(post.publishedAt || post.createdAt)}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="small"
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => setViewPost(post)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openModal(post)}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Delete this post?"
                        onConfirm={() => handleDelete(post._id)}
                      >
                        <Button size="small" type="text" danger icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <AdminTableCard>
          <Table
            dataSource={posts}
            columns={columns}
            rowKey="_id"
            pagination={false}
            scroll={{ x: 860 }}
          />
        </AdminTableCard>
      )}

      <Modal
        title={editId ? "Edit Post" : "Create New Post"}
        open={isModalOpen}
        onOk={handleSave}
        confirmLoading={saving}
        onCancel={() => setIsModalOpen(false)}
        okText={editId ? "Save Changes" : "Publish"}
        width={isMobile ? "95vw" : 520}
        centered={isMobile}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
            <Select
              options={brands.map((brand) => ({
                value: brand._id,
                label: brand.name,
              }))}
            />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter post title..." />
          </Form.Item>
          <Form.Item name="shortDescription" label="Short Description">
            <Input.TextArea rows={2} placeholder="Feed preview text..." />
          </Form.Item>
          <Form.Item
            name="body"
            label="Message / Description"
            rules={[{ required: true, message: "Body is required" }]}
          >
            <Input.TextArea rows={4} placeholder="Write your announcement here..." />
          </Form.Item>
          <Form.Item label="Banner Image (optional)">
            <Upload.Dragger
              accept="image/*"
              maxCount={1}
              beforeUpload={() => false}
              fileList={bannerFile}
              onChange={({ fileList }) => setBannerFile(fileList)}
            >
              <p className="ant-upload-drag-icon">
                <PictureOutlined style={{ color: PP.purple }} />
              </p>
              <p className="ant-upload-text">Click or drag image to upload</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="published" label="Status" initialValue={true}>
            <Select
              options={[
                { value: true, label: "Live" },
                { value: false, label: "Draft" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Post Details"
        open={!!viewPost}
        onCancel={() => setViewPost(null)}
        footer={
          <Space>
            <Button onClick={() => setViewPost(null)}>Close</Button>
            {viewPost && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  const post = viewPost;
                  setViewPost(null);
                  openModal(post);
                }}
              >
                Edit
              </Button>
            )}
          </Space>
        }
        width={isMobile ? "95vw" : 640}
        centered={isMobile}
      >
        {viewPost && (
          <div style={{ marginTop: 8 }}>
            {viewImageUrl ? (
              <div
                className="overflow-hidden mb-4"
                style={{
                  borderRadius: 16,
                  border: `1.5px solid ${PP.borderSoft}`,
                  background: PP.borderSoft,
                }}
              >
                {/* Banner URLs come from the API / CDN */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={viewImageUrl}
                  alt={viewPost.title}
                  className="w-full"
                  style={{
                    display: "block",
                    maxHeight: 320,
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-2 mb-4"
                style={{
                  height: 180,
                  borderRadius: 16,
                  border: `1.5px dashed ${PP.border}`,
                  background: PP.borderSoft,
                  color: PP.muted,
                }}
              >
                <PictureOutlined style={{ fontSize: 32 }} />
                <span style={{ fontFamily: F_BODY, fontSize: 13 }}>
                  No image uploaded
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <Space>
                <BrandMark
                  src={getBrandLogoUrl(viewBrand)}
                  alt={viewBrand?.name || "Brand"}
                  tint={viewBrand?.bgTint}
                  className="w-9 h-9 rounded-lg p-1"
                  imgClassName="w-full h-full"
                />
                <span
                  style={{
                    color: viewBrand?.accent || PP.purple,
                    fontWeight: 600,
                    fontFamily: F_BODY,
                  }}
                >
                  {viewBrand?.name || "Unknown"}
                </span>
              </Space>
              <Tag
                color={viewPost.published ? "green" : "orange"}
                style={{ border: 0, margin: 0 }}
              >
                {viewPost.published ? "Live" : "Draft"}
              </Tag>
            </div>

            <h3
              style={{
                fontFamily: F_HEAD,
                color: PP.ink,
                fontSize: 22,
                margin: "0 0 8px",
                lineHeight: 1.3,
              }}
            >
              {viewPost.title}
            </h3>
            <p
              className="text-xs mb-4"
              style={{ color: PP.gray, fontFamily: F_BODY }}
            >
              {formatApiDate(viewPost.publishedAt || viewPost.createdAt)}
            </p>

            {viewPost.shortDescription && (
              <p
                className="mb-3"
                style={{
                  color: PP.headingPurple,
                  fontFamily: F_BODY,
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                {viewPost.shortDescription}
              </p>
            )}

            {viewPost.highlight && (
              <p
                className="mb-3"
                style={{
                  color: PP.pink,
                  fontFamily: F_BODY,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {viewPost.highlight}
              </p>
            )}

            <div
              style={{
                background: "#FAF0FF",
                padding: 16,
                borderRadius: 12,
                border: `1.5px solid ${PP.borderSoft}`,
                color: PP.ink,
                fontFamily: F_BODY,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {viewPost.body || "No description"}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
