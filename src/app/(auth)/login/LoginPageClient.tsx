"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Card, ConfigProvider, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UseForm from "@/components/ui/UseForm";
import UseInput from "@/components/ui/UseInput";
import { BrandMark } from "@/components/admin/brand-mark";
import { handleLoginSuccess } from "@/lib/auth/auth.handlers";
import { useAppMessage } from "@/hooks/useAppMessage";
import { PUNKIES_LOGO } from "@/lib/admin/mock-data";
import { F_BODY, F_HEAD, GRADIENT, PP } from "@/lib/admin/theme";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { getErrorMessage } from "@/utils/getErrorMessage";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";
  const message = useAppMessage();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const defaultValues = useMemo<LoginFormValues>(
    () => ({ email: "", password: "" }),
    [],
  );

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const result = await loginUser(values).unwrap();
      const payload = result?.data;

      if (!payload?.accessToken) {
        const msg =
          result?.message ||
          "Login incomplete. Please verify your account or contact an admin.";
        setFormError(msg);
        message.error(msg);
        return;
      }

      if (!["admin", "super_admin"].includes(payload.role)) {
        const msg = "You are not authorized to access the admin panel.";
        setFormError(msg);
        message.error(msg);
        return;
      }

      handleLoginSuccess(payload.accessToken);
      message.success(result?.message || "Logged in successfully");
      router.replace(redirectTo.startsWith("/") ? redirectTo : "/admin");
    } catch (error) {
      const msg = getErrorMessage(error, "Login failed. Please try again.");
      setFormError(msg);
      message.error(msg);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: `linear-gradient(160deg, ${PP.bg} 0%, #fff 45%, ${PP.borderSoft} 100%)`,
      }}
    >
      <Card
        variant="borderless"
        className="w-full max-w-md"
        style={{
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(168,85,247,0.15)",
          border: `1.5px solid ${PP.border}`,
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div className="flex flex-col items-center text-center mb-8">
          <BrandMark
            src={PUNKIES_LOGO}
            alt="Punkies Playhouse"
            className="w-16 h-16 rounded-2xl mb-4"
            imgClassName="w-full h-full object-cover"
          />
          <Typography.Title
            level={3}
            style={{
              fontFamily: F_HEAD,
              color: PP.headingPurple,
              marginBottom: 4,
            }}
          >
            Admin Login
          </Typography.Title>
          <Typography.Paragraph
            style={{ color: PP.muted, fontFamily: F_BODY, marginBottom: 0 }}
          >
            Sign in to manage Punkies Playhouse Alerts
          </Typography.Paragraph>
        </div>

        {formError && (
          <Alert
            type="error"
            showIcon
            title={formError}
            className="mb-4"
            style={{ borderRadius: 12 }}
          />
        )}

        <ConfigProvider
          theme={{
            token: { colorPrimary: PP.purple },
            components: {
              Input: {
                activeBorderColor: PP.purple,
                hoverBorderColor: PP.pink,
              },
            },
          }}
        >
          <UseForm<LoginFormValues>
            onSubmit={onSubmit}
            resolver={zodResolver(loginSchema)}
            defaultValues={defaultValues}
          >
            <UseInput
              name="email"
              label="Email"
              type="email"
              required
              placeholder="admin@example.com"
              prefix={<MailOutlined style={{ color: PP.muted }} />}
            />
            <UseInput
              name="password"
              label="Password"
              type="password"
              required
              placeholder="Enter your password"
              prefix={<LockOutlined style={{ color: PP.muted }} />}
            />
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              block
              loading={isLoading}
              style={{
                marginTop: 8,
                height: 48,
                borderRadius: 14,
                border: "none",
                background: GRADIENT,
                fontWeight: 700,
              }}
            >
              Sign In
            </Button>
          </UseForm>
        </ConfigProvider>
      </Card>
    </div>
  );
}
