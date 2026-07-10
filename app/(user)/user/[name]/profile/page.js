import UserProfilePage from "@/app/_components/UserProfilePage";

export default async function Page({ params }) {
  const { name } = await params;
  console.log("NMAE", name);
  return <UserProfilePage username={name} />;
}
