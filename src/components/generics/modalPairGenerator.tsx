import React from 'react';
import { Button } from 'react-bootstrap';
import RoutedModal, { Props as RoutedModalProps } from './RoutedModal';

type ButtonProps = React.ComponentProps<typeof Button>;
type ButtonPropsNoClick = Omit<ButtonProps, 'onClick' | 'children'>;
type ClickHandler = (route: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

type DefaultModalProps = Pick<RoutedModalProps, 'modalOptions' | 'headerOptions' | 'onHide'>;

export type RoutedModalPair = { routedModal: React.ReactNode; button: React.ReactNode };

/**
 * Facilitates the creation of a button and a corresponding modal to be shown when the button is clicked.
 * @param modalProps Props that will get passed to the modal that is rendered on the button click.
 * @param buttonContent The content of the button element.
 * @param clickHandler The function to be called when the button is clicked to route to the modal's path.
 * @param buttonProps The optional props to be passed down to the button element. Cannot include onClick because
 * that is used to handle the clickHandler, so use the clickHandler instead.
 */
export function routedModalPairGenerator(
    modalProps: RoutedModalProps,
    buttonContent: React.ReactNode,
    clickHandler: ClickHandler,
    buttonProps?: ButtonPropsNoClick,
): RoutedModalPair {
    function generateButton(
        buttonContent: React.ReactNode,
        clickHandler: ClickHandler,
        buttonProps?: ButtonPropsNoClick,
    ): React.ReactNode {
        return (
            <Button
                {...buttonProps}
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                    clickHandler(modalProps.route, event)
                }
            >
                {buttonContent}
            </Button>
        );
    }

    function generateRoutedModal(routedModalProps: RoutedModalProps): React.ReactNode {
        return <RoutedModal {...routedModalProps} />;
    }

    return {
        button: generateButton(buttonContent, clickHandler, buttonProps),
        routedModal: generateRoutedModal(modalProps),
    };
}

/**
 * Facilitates the creation of a button and modal pair where the button calls an action
 * which would render the route corresponding with the modal.
 * This wraps around the routedModalPairGenerator function and saves some defaults,
 * for convenient access if you would like to apply the same properties to multiple generated routed modal pairs.
 */
export default class RoutedModalPairGenerator {
    defaultModalProps?: DefaultModalProps;
    defaultButtonProps?: ButtonPropsNoClick;
    clickHandler: ClickHandler;

    /**
     * @param clickHandler The function to called when this pair's button is clicked, and it is time to show the modal.
     * @param defaultButtonProps Default props to pass to the button that is generated.
     * @param defaultModalProps Default props to pass to the generated modal.
     */
    constructor(
        clickHandler: ClickHandler,
        defaultButtonProps?: ButtonPropsNoClick,
        defaultModalProps?: DefaultModalProps,
    ) {
        this.clickHandler = clickHandler;
        this.defaultButtonProps = defaultButtonProps;
        this.defaultModalProps = defaultModalProps;
    }

    generate(
        buttonContent: React.ReactNode,
        modalProps: RoutedModalProps,
        buttonProps?: ButtonPropsNoClick,
    ): ReturnType<typeof routedModalPairGenerator> {
        return routedModalPairGenerator(
            { ...this.defaultModalProps, ...modalProps },
            buttonContent,
            this.clickHandler,
            {
                ...this.defaultButtonProps,
                ...buttonProps,
            },
        );
    }
}
