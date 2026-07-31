import * as Notifications from 'expo-notifications';

export async function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  const permissions = await Notifications.getPermissionsAsync();
  if (permissions.status !== 'granted') await Notifications.requestPermissionsAsync();
}

export async function notifyGenerationComplete(title: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Your Fakhm video is ready', body: title },
    trigger: null,
  });
}
