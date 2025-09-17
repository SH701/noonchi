import { Stack, usePathname } from "expo-router";
import TabBar from "../../components/etc/tab-bar";

export default function MainLayout() {
  const pathname = usePathname();

  const showTabBar = [
    "/main",
    "/main/profile",
    "/main/chatbot",
  ].includes(pathname);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="chatbot/index" />
        <Stack.Screen name="custom/index" />
        <Stack.Screen name="honorific/index" />
        <Stack.Screen name="profile/index" />
      </Stack>
      {showTabBar && <TabBar />}
    </>
  );
}
