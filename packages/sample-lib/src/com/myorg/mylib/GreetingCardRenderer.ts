/*!
 * ${copyright}
 */

import Lib from "sap/ui/core/Lib";
import RenderManager from "sap/ui/core/RenderManager";
import GreetingCard from "./GreetingCard";
import { ExampleColor } from "./library";

/**
 * GreetingCard renderer.
 * @namespace
 */
export default {
	apiVersion: 2, // usage of DOM Patcher

	/**
	 * Renders the HTML for the given control, using the provided {@link RenderManager}.
	 *
	 * @param rm The reference to the <code>sap.ui.core.RenderManager</code>
	 * @param control The control instance to be rendered
	 */
	render: function (rm: RenderManager, control: GreetingCard) {
		const i18n = Lib.getResourceBundleFor("com.myorg.mylib");

		rm.openStart("div", control);
		rm.class("myLibPrefixGreetingCard");
		if (control.getColor() === ExampleColor.Highlight) {
			rm.class("myLibPrefixGreetingCardHighlight");
		}
		rm.attr("tabindex", "0");
		rm.openEnd();

		rm.openStart("div");
		rm.class("myLibPrefixGreetingCardTitle");
		rm.openEnd();
		rm.text(i18n.getText("GREETING_TITLE"));
		rm.close("div");

		rm.openStart("div");
		rm.class("myLibPrefixGreetingCardText");
		rm.openEnd();
		rm.text(
			i18n.getText("GREETING_TEXT", [
				control.getName() || i18n.getText("GREETING_FALLBACK_NAME"),
			]),
		);
		rm.close("div");

		rm.close("div");
	},
};
