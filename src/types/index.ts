export type ExtensionPermission = {
  name: string;
  risk: number;
};

export type ExtensionItem = {
  id: string;
  name: string;
  version: string;
  description: string;
  permissions: ExtensionPermission[];
  enabled: boolean;
  icon?: string;
  category: string;
};

export type TabItem = {
  id: number;
  title: string;
  url: string;
  audible: boolean;
  favIconUrl?: string;
};

export type ResourceImpact = {
  extensionId: string;
  extensionName: string;
  tabs: Array<{
    tabId: number;
    tabTitle: string;
    cpu: number;
    ram: number;
  }>;
};
