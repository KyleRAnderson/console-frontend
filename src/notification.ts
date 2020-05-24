import { store } from 'react-notifications-component';

namespace Notifications {
    type Transition = {
        duration?: number;
        timingFunction?: string;
        delay?: number;
    };
    export type NotificationConfig = {
        id?: string;
        onRemoval?: (id: string, removedBy: any) => void;
        title?: string;
        message: string;
        content?: React.Component | JSX.Element;
        type?: 'success' | 'danger' | 'info' | 'default' | 'warning';
        container?:
            | 'top-left'
            | 'top-right'
            | 'top-center'
            | 'center'
            | 'bottom-left'
            | 'bottom-right'
            | 'bottom-center';
        insert?: 'top' | 'bottom';
        dismiss?: {
            duration?: number;
            onScreen?: boolean;
            pauseOnHover?: boolean;
            waitForAnimation?: boolean;
            click?: boolean;
            touch?: boolean;
            showIcon?: boolean;
        };
        animationIn?: string[];
        animationOut?: string[];
        slidingEnter?: Transition;
        slidingExit?: Transition;
        touchRevert?: Transition;
        touchSlidingExit?: Transition;
        width?: number;
    };

    const defaultConfig: Partial<NotificationConfig> = {
        insert: 'top',
        container: 'top-right',
        animationIn: ['animated', 'fadeIn'],
        animationOut: ['animated', 'fadeOut'],
        dismiss: {
            duration: 3500,
            pauseOnHover: true,
            onScreen: true,
            showIcon: true,
        },
    };

    export function createNotification(config: NotificationConfig) {
        store.addNotification({ ...defaultConfig, ...config });
    }
}
export default Notifications;
