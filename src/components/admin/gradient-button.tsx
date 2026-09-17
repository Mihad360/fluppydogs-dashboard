"use client";

import { Button, type ButtonProps } from "antd";
import { gradientButtonStyle, PP } from "@/lib/admin/theme";

interface GradientButtonProps extends ButtonProps {
  saved?: boolean;
}

export function GradientButton({
  saved,
  style,
  children,
  ...props
}: GradientButtonProps) {
  return (
    <Button
      type="primary"
      {...props}
      style={{
        ...gradientButtonStyle,
        background: saved ? PP.green : gradientButtonStyle.background,
        ...style,
      }}
    >
      {children}
    </Button>
  );
}
