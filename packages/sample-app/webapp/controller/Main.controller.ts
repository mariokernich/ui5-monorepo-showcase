import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import type GreetingCard from "com/myorg/mylib/GreetingCard";
import type { GreetingCard$PressEvent } from "com/myorg/mylib/GreetingCard";

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Main extends BaseController {
	public sayHello(): void {
		MessageBox.show("Hello World!");
	}

	public onGreetingCardPress(event: GreetingCard$PressEvent): void {
		const card = event.getSource() as GreetingCard;
		MessageToast.show(`Greeting card pressed by ${card.getName()}`);
	}
}
