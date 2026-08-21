import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "../../../contexts/ThemeContext";

/**
 * Toast host. Must be mounted once, near the app root, or every `toast()`
 * call in the app silently does nothing.
 *
 * Reads the app's own ThemeContext -- this previously pulled from
 * `next-themes`, which has no provider mounted anywhere.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      richColors
      closeButton
      className="toaster group"
      {...props}
    />
  );
};

export { Toaster };
