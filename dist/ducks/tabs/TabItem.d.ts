import React from "react";
import { Tab } from "./index";
export interface TabItemProps extends Tab {
    onSelect: () => void;
    onClose?: () => void;
}
declare const TabItem: React.FC<TabItemProps>;
export default TabItem;
