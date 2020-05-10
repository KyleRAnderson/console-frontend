import { store } from 'react-notifications-component';

namespace Notifications {
    export interface NotificationProperties {
        title?: string;
        message?: string;
        type?: 'success' | 'danger' | 'info' | 'default' | 'warning';
        container?:
            | 'top-left'
            | 'top-right'
            | 'top-center'
            | 'center'
            | 'bottom-left'
            | 'bottom-right'
            | 'bottom-center';
        animationIn?: string[];
        animationOut?: string[];
    }

    export const defaultDuration: number = 3500;

    export function createNotification(config: NotificationProperties) {
        store.addNotification({
            insert: 'top',
            container: 'top-right',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: {
                duration: defaultDuration,
                onScreen: true,
            },
            ...config,
        });
    }
}
export default Notifications;
