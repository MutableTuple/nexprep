import { Section, Heading, Text, Button, Img } from "@react-email/components";
import EmailLayout, { emailStyles } from "./components/EmailLayout";

export default function FriendRequest({
  recipientName = "there",
  senderName = "Someone",
  senderUsername = "user",
  senderAvatarUrl,
  acceptUrl = "https://rankgrind.com/friends",
}) {
  return (
    <EmailLayout
      previewText={`${senderName} sent you a friend request on rankgrind.com`}
    >
      <Section>
        {senderAvatarUrl && (
          <Img
            src={senderAvatarUrl}
            width="48"
            height="48"
            alt={senderName}
            style={{ ...emailStyles.avatar, marginBottom: "16px" }}
          />
        )}
        <Heading style={emailStyles.heading}>
          {senderName} wants to be your friend
        </Heading>
        <Text style={emailStyles.text}>
          Hey {recipientName}, <strong>{senderName}</strong> (@{senderUsername})
          sent you a friend request on rankgrind.com. Accept it to see their
          progress and challenge them to a duel.
        </Text>

        <Button href={acceptUrl} style={emailStyles.button}>
          View request
        </Button>
      </Section>
    </EmailLayout>
  );
}

FriendRequest.PreviewProps = {
  recipientName: "Yogesh",
  senderName: "Arjun Sharma",
  senderUsername: "arjun_s",
  senderAvatarUrl: "https://i.pravatar.cc/96?img=12",
  acceptUrl: "https://rankgrind.com/friends",
};
