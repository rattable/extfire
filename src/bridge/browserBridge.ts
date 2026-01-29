import { mockExtensions, mockTabs } from "../data/mockData";
import { ExtensionItem, TabItem } from "../types";

type BrowserAPI = typeof browser | typeof chrome | undefined;

declare const browser: BrowserAPI;
declare const chrome: BrowserAPI;

const getBrowser = (): BrowserAPI => {
  if (typeof browser !== "undefined" && browser?.management) {
    return browser;
  }

  if (typeof chrome !== "undefined" && chrome?.management) {
    return chrome;
  }

  return undefined;
};

const filterSelf = (extensions: ExtensionItem[]) =>
  extensions.filter(
    (extension) => !/exocore|roichi/i.test(extension.name)
  );

export const obtenirExtensions = async (): Promise<ExtensionItem[]> => {
  const api = getBrowser();

  if (!api?.management) {
    return filterSelf(mockExtensions);
  }

  const items = await api.management.getAll();
  return filterSelf(
    items.map((item) => ({
      id: item.id,
      name: item.name,
      version: item.version,
      description: item.description || "Aucune description disponible.",
      permissions: (item.permissions || []).map((permission) => ({
        name: permission,
        risk: permission.includes("webRequest") ? 5 : 2
      })),
      enabled: item.enabled,
      icon: item.icons?.[0]?.url,
      category: item.type === "theme" ? "Thème" : "Extension"
    }))
  );
};

export const activerExtension = async (id: string, enabled: boolean) => {
  const api = getBrowser();
  if (api?.management?.setEnabled) {
    await api.management.setEnabled(id, enabled);
  }
};

export const obtenirTabs = async (): Promise<TabItem[]> => {
  const api = getBrowser();

  if (!api?.tabs) {
    return mockTabs;
  }

  const tabs = await api.tabs.query({});
  return tabs.map((tab) => ({
    id: tab.id || 0,
    title: tab.title || "Onglet sans titre",
    url: tab.url || "",
    audible: Boolean(tab.audible),
    favIconUrl: tab.favIconUrl
  }));
};

export const fermerOnglet = async (id: number) => {
  const api = getBrowser();
  if (api?.tabs?.remove) {
    await api.tabs.remove(id);
  }
};

export const focusTab = async (id: number) => {
  const api = getBrowser();
  if (api?.tabs?.update) {
    await api.tabs.update(id, { active: true });
  }
};
