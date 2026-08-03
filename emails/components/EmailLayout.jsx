import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Img,
  Hr,
  Text,
  Link,
} from "@react-email/components";

const ACCENT = "#fbbf24"; // amber-400, matches the site's gamified accent

export default function EmailLayout({ previewText, children }) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Img
              src="https://rankgrind.com/icon.png"
              width="32"
              height="32"
              alt="rankgrind.com"
              style={styles.logo}
            />
            <Text style={styles.brand}>rankgrind.com</Text>
          </Section>

          {children}

          <Hr style={styles.hr} />
          <Section>
            <Text style={styles.footerText}>
              You&apos;re receiving this because you have an account on{" "}
              <Link href="https://rankgrind.com" style={styles.footerLink}>
                rankgrind.com
              </Link>
              .{" "}
              <Link
                href="https://rankgrind.com/settings/notifications"
                style={styles.footerLink}
              >
                Manage email preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: "24px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    margin: "0 auto",
    padding: "32px",
    maxWidth: "480px",
    border: "1px solid #e4e4e7",
  },
  header: {
    marginBottom: "24px",
  },
  logo: {
    borderRadius: "6px",
    display: "inline-block",
    verticalAlign: "middle",
  },
  brand: {
    display: "inline-block",
    verticalAlign: "middle",
    marginLeft: "8px",
    fontSize: "15px",
    fontWeight: 700,
    color: "#18181b",
  },
  hr: {
    borderColor: "#e4e4e7",
    margin: "32px 0 16px",
  },
  footerText: {
    fontSize: "12px",
    color: "#a1a1aa",
    lineHeight: "18px",
  },
  footerLink: {
    color: "#a1a1aa",
    textDecoration: "underline",
  },
};

export const emailStyles = {
  heading: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#18181b",
    margin: "0 0 12px",
  },
  text: {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#52525b",
    margin: "0 0 20px",
  },
  button: {
    backgroundColor: ACCENT,
    color: "#18181b",
    fontSize: "14px",
    fontWeight: 700,
    padding: "12px 24px",
    borderRadius: "9999px",
    textDecoration: "none",
    display: "inline-block",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#fef3c7",
    color: "#b45309",
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "9999px",
    marginBottom: "16px",
  },
  metaRow: {
    fontSize: "13px",
    color: "#71717a",
    margin: "0 0 20px",
  },
  avatar: {
    borderRadius: "9999px",
    display: "block",
  },
};
