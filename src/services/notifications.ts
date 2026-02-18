import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    return finalStatus === 'granted';
};

export const scheduleTaskNotification = async (title: string, body: string, date: Date) => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    try {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date,
            },
        });
        return id;
    } catch (e) {
        console.error('Failed to schedule notification', e);
        return null;
    }
};

export const cancelTaskNotification = async (notificationId: string) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (e) {
        console.error('Failed to cancel notification', e);
    }
};
