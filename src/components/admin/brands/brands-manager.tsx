"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { BrandMark } from "@/components/admin/brand-mark";
import { GradientButton } from "@/components/admin/gradient-button";
import { SectionTitle } from "@/components/admin/section-title";
import { useAppMessage } from "@/hooks/useAppMessage";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import {
  buildJsonFormData,
  getBrandLogoUrl,
} from "@/lib/admin/api-helpers";
import { F_HEAD } from "@/lib/admin/theme";
import {
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
} from "@/redux/api/brandsApi";
import type { ApiBrand } from "@/types/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface BrandFormValues {
  name: string;
  color?: string;
  description?: string;
}

export function BrandsManager() {
  const message = useAppMessage();
  const { data, isLoading, isError, error, refetch } = useGetBrandsQuery({
    limit: 100,
    sort: "sortOrder",
  });
  const [createBrand, { isLoading: creating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: deleting }] = useDeleteBrandMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<BrandFormValues>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<UploadFile[]>([]);
  const { isMobile } = useBreakpoint();

  const brands = useMemo(() => data?.data ?? [], [data]);
  const saving = creating || updating;

  const openModal = (brand?: ApiBrand) => {
    setLogoFile([]);
    if (brand) {
      setEditingId(brand._id);
      form.setFieldsValue({
        name: brand.name,
        color: brand.accent,
        description: brand.description || undefined,
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ color: "#A855F7" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        accent: values.color || "#A855F7",
        description: values.description || undefined,
      };
      const file = logoFile[0]?.originFileObj as File | undefined;
      const formData = buildJsonFormData(payload, { logo: file });

      if (editingId) {
        await updateBrand({ id: editingId, data: formData }).unwrap();
        message.success("Brand updated");
      } else {
        await createBrand(formData).unwrap();
        message.success("Brand added");
      }
      setIsModalOpen(false);
      setLogoFile([]);
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error(getErrorMessage(err, "Failed to save brand"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBrand(id).unwrap();
      message.success("Brand deleted");
    } catch (err) {
      message.error(getErrorMessage(err, "Failed to delete brand"));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <SectionTitle>Brands/Items 🏷️</SectionTitle>
        <GradientButton icon={<PlusOutlined />} onClick={() => openModal()}>
          Add Item
        </GradientButton>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          title={getErrorMessage(error, "Failed to load brands")}
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : brands.length === 0 ? (
        <Empty description="No brands yet" />
      ) : (
        <Row gutter={[20, 20]}>
          {brands.map((brand) => (
            <Col xs={24} sm={12} key={brand._id}>
              <Card
                variant="borderless"
                style={{
                  borderRadius: 16,
                  boxShadow: `0 2px 16px ${brand.accent}18`,
                  border: `1.5px solid ${brand.accent}22`,
                }}
              >
                <BrandMark
                  src={getBrandLogoUrl(brand)}
                  alt={brand.name}
                  tint={brand.bgTint}
                  className="w-full h-32 rounded-xl mb-4"
                  imgClassName="max-h-full max-w-full p-4"
                />
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <Typography.Title
                      level={5}
                      style={{ fontFamily: F_HEAD, margin: 0 }}
                    >
                      {brand.name}
                    </Typography.Title>
                    <Tag
                      color={brand.isActive === false ? "default" : brand.accent}
                      style={{ marginTop: 8, border: 0 }}
                    >
                      {brand.isActive === false ? "Inactive" : "Active"}
                    </Tag>
                  </div>
                  <Space>
                    <Button
                      type="primary"
                      ghost
                      icon={<EditOutlined />}
                      onClick={() => openModal(brand)}
                    >
                      {isMobile ? "" : "Edit"}
                    </Button>
                    <Popconfirm
                      title="Delete this brand?"
                      onConfirm={() => handleDelete(brand._id)}
                      okButtonProps={{ loading: deleting }}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={editingId ? "Edit Brand/Item" : "Add Brand/Item"}
        open={isModalOpen}
        onOk={handleSave}
        confirmLoading={saving}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        width={isMobile ? "95vw" : 520}
        centered={isMobile}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="name" label="Brand/Item Name" rules={[{ required: true }]}>
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item label="Logo Upload">
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={() => false}
              fileList={logoFile}
              onChange={({ fileList }) => setLogoFile(fileList)}
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="color" label="Color Tag/Theme">
            <Input type="color" style={{ width: 100, padding: 0 }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Optional description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
