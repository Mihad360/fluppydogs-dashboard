"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Button, Card, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { GradientButton } from "@/components/admin/gradient-button";
import { SectionTitle } from "@/components/admin/section-title";
import RichEditor from "@/components/ui/RichEditor";
import { useAppMessage } from "@/hooks/useAppMessage";
import { F_BODY, PP } from "@/lib/admin/theme";
import {
  useGetLegalDocQuery,
  useUpdateLegalDocMutation,
  type LegalDocType,
} from "@/redux/api/settingsApi";
import { getErrorMessage } from "@/utils/getErrorMessage";

const DOC_META: Record<
  LegalDocType,
  { title: string; subtitle: string }
> = {
  privacy: {
    title: "Edit Privacy Policy",
    subtitle: "Shown under Community & Legal → Privacy in the app",
  },
  terms: {
    title: "Edit Terms & Conditions",
    subtitle: "Shown under Community & Legal → Terms in the app",
  },
  about: {
    title: "Edit About Us",
    subtitle: "Shown under Community & Legal → About in the app",
  },
};

export function LegalDocEditor({ type }: { type: LegalDocType }) {
  const message = useAppMessage();
  const meta = DOC_META[type];
  const { data, isLoading, isError, error, refetch } = useGetLegalDocQuery(type);
  const [updateLegalDoc, { isLoading: saving }] = useUpdateLegalDocMutation();
  const [content, setContent] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (data !== undefined) {
      const description = data?.data?.description || "";
      console.log("[LegalDocEditor] loaded from API", {
        type,
        rawResponse: data,
        descriptionHtml: description,
      });
      setContent(description);
      setReady(true);
    }
  }, [data, type]);

  const onSave = async () => {
    const trimmed = content.trim();
    if (!trimmed || trimmed === "<p></p>") {
      message.error("Content cannot be empty");
      return;
    }

    const payload = { type, description: content };

    // Debug: inspect exact HTML the frontend sends (colors = <span style="color:...">)
    console.log("[LegalDocEditor] save request", {
      type,
      descriptionLength: content.length,
      descriptionHtml: content,
      payload,
    });

    try {
      const result = await updateLegalDoc(payload).unwrap();

      console.log("[LegalDocEditor] save response", {
        type,
        result,
        savedDescription: result?.data?.description,
      });

      message.success(`${meta.title.replace("Edit ", "")} saved`);
    } catch (err) {
      console.error("[LegalDocEditor] save error", err);
      message.error(getErrorMessage(err, "Failed to save document"));
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/settings" className="no-underline">
          <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: PP.hamburger }}>
            Back to App Settings
          </Button>
        </Link>
      </div>

      <SectionTitle>{meta.title}</SectionTitle>
      <p
        className="text-sm mb-5"
        style={{ color: PP.muted, fontFamily: F_BODY, marginTop: -8 }}
      >
        {meta.subtitle}
      </p>

      {isError && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          title={getErrorMessage(error, "Failed to load document")}
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      )}

      {isLoading || !ready ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Card
          variant="borderless"
          style={{
            borderRadius: 16,
            border: `1.5px solid ${PP.border}`,
          }}
        >
          <RichEditor
            value={content}
            onChange={setContent}
            placeholder="Write your content..."
            minHeight={360}
          />
          <div className="flex justify-end mt-4">
            <GradientButton
              size="large"
              onClick={onSave}
              loading={saving}
              style={{ borderRadius: 12 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </GradientButton>
          </div>
        </Card>
      )}
    </div>
  );
}
