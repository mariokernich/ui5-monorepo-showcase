/*!
 * ${copyright}
 */
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import GreetingCardRenderer from "./GreetingCardRenderer";
import { ExampleColor } from "./library";

/**
 * Constructor for a new <code>com.myorg.mylib.GreetingCard</code> control.
 *
 * A simple card control that greets a person by name.
 * @extends Control
 *
 * @author Mario Kernich
 * @version ${version}
 *
 * @constructor
 * @public
 * @name com.myorg.mylib.GreetingCard
 */
export default class GreetingCard extends Control {
	// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
	constructor(id?: string | $GreetingCardSettings);
	constructor(id?: string, settings?: $GreetingCardSettings);
	constructor(id?: string, settings?: $GreetingCardSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "com.myorg.mylib",
		properties: {
			/**
			 * The name of the person to greet.
			 */
			name: {
				type: "string",
				group: "Data",
				defaultValue: "",
			},
			/**
			 * The color scheme of the card (defaults to "Default").
			 */
			color: {
				type: "com.myorg.mylib.ExampleColor",
				group: "Appearance",
				defaultValue: ExampleColor.Default,
			},
		},
		events: {
			/**
			 * Event is fired when the user clicks the card.
			 */
			press: {},
		},
	};

	static renderer: typeof GreetingCardRenderer = GreetingCardRenderer;

	onclick = () => {
		this.firePress();
	};
}
