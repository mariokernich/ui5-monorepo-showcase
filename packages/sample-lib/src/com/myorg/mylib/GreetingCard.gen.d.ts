import Event from "sap/ui/base/Event";
import { ExampleColor } from "com/myorg/mylib/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./GreetingCard" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $GreetingCardSettings extends $ControlSettings {

        /**
         * The name of the person to greet.
         */
        name?: string | PropertyBindingInfo;

        /**
         * The color scheme of the card (defaults to "Default").
         */
        color?: ExampleColor | PropertyBindingInfo | `{${string}}`;

        /**
         * Event is fired when the user clicks the card.
         */
        press?: (event: GreetingCard$PressEvent) => void;
    }

    export default interface GreetingCard {

        // property: name

        /**
         * The name of the person to greet.
         */
        getName(): string;

        /**
         * The name of the person to greet.
         */
        setName(name: string): this;

        // property: color

        /**
         * The color scheme of the card (defaults to "Default").
         */
        getColor(): ExampleColor;

        /**
         * The color scheme of the card (defaults to "Default").
         */
        setColor(color: ExampleColor): this;

        // event: press

        /**
         * Event is fired when the user clicks the card.
         */
        attachPress(fn: (event: GreetingCard$PressEvent) => void, listener?: object): this;

        /**
         * Event is fired when the user clicks the card.
         */
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: GreetingCard$PressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Event is fired when the user clicks the card.
         */
        detachPress(fn: (event: GreetingCard$PressEvent) => void, listener?: object): this;

        /**
         * Event is fired when the user clicks the card.
         */
        firePress(parameters?: GreetingCard$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of GreetingCard's 'press' event.
     * Event is fired when the user clicks the card.
     */
    // eslint-disable-next-line
    export interface GreetingCard$PressEventParameters {
    }

    /**
     * Type describing the GreetingCard's 'press' event.
     * Event is fired when the user clicks the card.
     */
    export type GreetingCard$PressEvent = Event<GreetingCard$PressEventParameters>;
}
