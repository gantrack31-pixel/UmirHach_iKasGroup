type IconName = "upload" | "folder" | "file" | "close" | "chat" | "send" | "external" | "check";

type IconProps = {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 22 }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "upload":
      return <svg {...common}><path d="M12 19v-9m0 0L8 14m4-4 4 4"/><path d="M6.5 18h10a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 5.2 10.5 3.8 3.8 0 0 0 6.5 18Z"/></svg>;
    case "folder":
      return <svg {...common}><path d="M3.5 6.5h6l2 2h9v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path d="M3.5 8.5v-2a2 2 0 0 1 2-2h4l2 2"/></svg>;
    case "file":
      return <svg {...common}><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z"/><path d="M13 3v7h7"/></svg>;
    case "close":
      return <svg {...common}><path d="m18 6-12 12M6 6l12 12"/></svg>;
    case "chat":
      return <svg {...common}><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.6-.85L4 20l1.25-4.25A7.5 7.5 0 1 1 20 11.5Z"/></svg>;
    case "send":
      return <svg {...common}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
    case "external":
      return <svg {...common}><path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></svg>;
    case "check":
      return <svg {...common} strokeWidth={2.6}><path d="m5 12 4 4L19 6"/></svg>;
  }
}