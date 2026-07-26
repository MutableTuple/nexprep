import { Section, Heading, Text, Button, Img } from "@react-email/components";
import EmailLayout, { emailStyles } from "./components/EmailLayout";

export default function NewFollower({
  recipientName = "there",
  followerName = "Someone",
  followerUsername = "user",
  followerAvatarUrl,
  followerProfileUrl = "https://rankgrind.com",
}) {
  return (
    <EmailLayout
      previewText={`${followerName} started following you on rankgrind.com`}
    >
      <Section>
        {followerAvatarUrl && (
          <Img
            src={followerAvatarUrl}
            width="48"
            height="48"
            alt={followerName}
            style={{ ...emailStyles.avatar, marginBottom: "16px" }}
          />
        )}
        <Heading style={emailStyles.heading}>
          {followerName} started following you
        </Heading>
        <Text style={emailStyles.text}>
          Hey {recipientName}, <strong>{followerName}</strong> (@
          {followerUsername}) just followed you on rankgrind.com. Check out
          their profile and see how you compare.
        </Text>

        <Button href={followerProfileUrl} style={emailStyles.button}>
          View profile
        </Button>
      </Section>
    </EmailLayout>
  );
}

NewFollower.PreviewProps = {
  recipientName: "Yogesh",
  followerName: "Priyanshu Jha",
  followerUsername: "priyanshu_j",
  followerAvatarUrl: "https://i.pravatar.cc/96?img=5",
  followerProfileUrl: "https://rankgrind.com/user/priyanshu_j/profile",
};
