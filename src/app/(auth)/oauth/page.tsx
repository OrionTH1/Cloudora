import OAuthSign from "@/components/OAuthSign";

async function OAuth({ searchParams }: SearchParamProps) {
  const userId = (await searchParams)?.userId;
  const secret = (await searchParams)?.secret;

  if (userId && secret) {
    return <OAuthSign secret={secret as string} userId={userId as string} />;
  } else {
    <div></div>;
  }
}

export default OAuth;
