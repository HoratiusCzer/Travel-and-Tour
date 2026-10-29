// Re-mounts on every navigation, so each page fades in (opacity only, to keep sticky layouts intact).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
