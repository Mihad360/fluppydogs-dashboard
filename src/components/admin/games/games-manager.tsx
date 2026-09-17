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
  Table,
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { AdminTableCard } from "@/components/admin/admin-table-card";
import { BrandMark } from "@/components/admin/brand-mark";
import { GradientButton } from "@/components/admin/gradient-button";
import { SectionTitle } from "@/components/admin/section-title";
import { useAppMessage } from "@/hooks/useAppMessage";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { buildJsonFormData } from "@/lib/admin/api-helpers";
import { PP } from "@/lib/admin/theme";
import {
  useCreateGameMutation,
  useDeleteGameMutation,
  useGetGamesQuery,
  useUpdateGameMutation,
  type ApiGame,
} from "@/redux/api/gamesApi";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface GameFormValues {
  name: string;
  url: string;
  emoji?: string;
}

export function GamesManager() {
  const message = useAppMessage();
  const { data, isLoading, isError, error, refetch } = useGetGamesQuery({
    limit: 100,
    sort: "sortOrder",
  });
  const [createGame, { isLoading: creating }] = useCreateGameMutation();
  const [updateGame, { isLoading: updating }] = useUpdateGameMutation();
  const [deleteGame, { isLoading: deleting }] = useDeleteGameMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<GameFormValues>();
  const [editId, setEditId] = useState<string | null>(null);
  const [thumbFile, setThumbFile] = useState<UploadFile[]>([]);
  const { isMobile } = useBreakpoint();

  const games = useMemo(() => data?.data ?? [], [data]);
  const saving = creating || updating;

  const openModal = (game?: ApiGame) => {
    setThumbFile([]);
    if (game) {
      setEditId(game._id);
      form.setFieldsValue({
        name: game.name,
        url: game.url,
        emoji: game.emoji || "🎮",
      });
    } else {
      setEditId(null);
      form.resetFields();
      form.setFieldsValue({ emoji: "🎮" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        url: values.url,
        emoji: values.emoji || "🎮",
      };
      const file = thumbFile[0]?.originFileObj as File | undefined;
      const formData = buildJsonFormData(payload, { thumbnail: file });

      if (editId) {
        await updateGame({ id: editId, data: formData }).unwrap();
        message.success("Game updated");
      } else {
        await createGame(formData).unwrap();
        message.success("Game added");
      }
      setIsModalOpen(false);
      setThumbFile([]);
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error(getErrorMessage(err, "Failed to save game"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGame(id).unwrap();
      message.success("Game deleted");
    } catch (err) {
      message.error(getErrorMessage(err, "Failed to delete game"));
    }
  };

  const columns: ColumnsType<ApiGame> = [
    {
      title: "Icon",
      key: "icon",
      width: 80,
      render: (_, record) =>
        record.thumbnail?.url ? (
          <BrandMark
            src={record.thumbnail.url}
            alt={record.name}
            className="w-10 h-10 rounded-xl"
            imgClassName="w-full h-full object-cover"
          />
        ) : (
          <div
            className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ background: PP.borderSoft }}
          >
            {record.emoji || "🎮"}
          </div>
        ),
    },
    { title: "Game Name", dataIndex: "name", key: "name" },
    { title: "External URL", dataIndex: "url", key: "url", ellipsis: true },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this game?"
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
        <SectionTitle>Mini Games 🎮</SectionTitle>
        <GradientButton icon={<PlusOutlined />} onClick={() => openModal()}>
          Add Game
        </GradientButton>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          title={getErrorMessage(error, "Failed to load games")}
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
      ) : games.length === 0 ? (
        <Empty description="No games yet" />
      ) : isMobile ? (
        <div className="flex flex-col gap-3">
          {games.map((game) => (
            <Card
              key={game._id}
              variant="borderless"
              style={{ borderRadius: 16, border: `1.5px solid ${PP.border}` }}
            >
              <div className="flex items-center gap-3">
                {game.thumbnail?.url ? (
                  <BrandMark
                    src={game.thumbnail.url}
                    alt={game.name}
                    className="w-12 h-12 rounded-xl flex-shrink-0"
                    imgClassName="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: PP.borderSoft }}
                  >
                    {game.emoji || "🎮"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1" style={{ color: PP.ink }}>
                    {game.name}
                  </p>
                  <p className="text-xs truncate mb-2" style={{ color: PP.gray }}>
                    {game.url}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => openModal(game)}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Delete this game?"
                      onConfirm={() => handleDelete(game._id)}
                    >
                      <Button size="small" type="text" danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <AdminTableCard>
          <Table
            dataSource={games}
            columns={columns}
            rowKey="_id"
            pagination={false}
            scroll={{ x: 550 }}
          />
        </AdminTableCard>
      )}

      <Modal
        title={editId ? "Edit Game" : "Add Game"}
        open={isModalOpen}
        onOk={handleSave}
        confirmLoading={saving}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        width={isMobile ? "95vw" : 520}
        centered={isMobile}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="name" label="Game Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Squadies Rescue" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="url" label="Browser URL" rules={[{ required: true }]}>
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="emoji" label="Emoji fallback">
            <Input placeholder="🎮" />
          </Form.Item>
          <Form.Item label="Thumbnail Upload">
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={() => false}
              fileList={thumbFile}
              onChange={({ fileList }) => setThumbFile(fileList)}
            >
              <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
