import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Container from "sap/ushell/Container";
import MessageToast from "sap/m/MessageToast";
import Extension from "sap/ushell/services/Extension";

/**
 * @namespace com.myorg.myplugin
 */
export default class Component extends UIComponent {
	public static metadata = {
		manifest: "json",
		interfaces: ["sap.ui.core.IAsyncContentCreation"],
	};

	// ============================================================
	// Plugin type: Launchpad Header Button
	// ============================================================

	public init() {
		super.init();
		void this.initPlugin();
	}

	private async initPlugin() {
		// load translations from i18n model
		const resourceModel = this.getModel("i18n") as ResourceModel;
		const resourceBundle = await resourceModel.getResourceBundle();

		// fetch Extension service
		const extension = await Container.getServiceAsync<Extension>("Extension");

		// register header button
		const item = await extension.createHeaderItem({
			icon: "sap-icon://hello-world",
			text: resourceBundle.getText("btnText"),
			press: () => {
				MessageToast.show("Hello World");
			},
		});

		item.showForAllApps();
		item.showOnHome();
	}
}
