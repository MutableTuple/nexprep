import UserProfilePage from "@/app/_components/UserProfilePage";

export default async function Page({ params }) {
  const { name } = await params;
  return <UserProfilePage username={name} />;
}
