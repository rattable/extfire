import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  activerExtension,
  fermerOnglet,
  focusTab,
  obtenirExtensions,
  obtenirTabs
} from "./bridge/browserBridge";
import { extensionTypes, memoryHistory } from "./data/mockData";
import { ExtensionItem, ResourceImpact, TabItem } from "./types";

type ViewKey =
  | "dashboard"
  | "extensions"
  | "security"
  | "tabs"
  | "resources";

const navigation = [
  { key: "dashboard", label: "Tableau de Bord", icon: "📡" },
  { key: "extensions", label: "Matrice d'Extensions", icon: "🧩" },
  { key: "security", label: "Console de Sécurité", icon: "🧠" },
  { key: "tabs", label: "Gestion des Onglets", icon: "🗂️" },
  { key: "resources", label: "Moniteur Ressources", icon: "📊" }
] as const;

const formatNumber = (value: number) => value.toLocaleString("fr-FR");

const buildResourceImpact = (
  extensions: ExtensionItem[],
  tabs: TabItem[]
): ResourceImpact[] =>
  extensions.map((extension) => {
    const impactedTabs = tabs.slice(0, Math.max(1, Math.round(Math.random() * 3)));
    return {
      extensionId: extension.id,
      extensionName: extension.name,
      tabs: impactedTabs.map((tab) => ({
        tabId: tab.id,
        tabTitle: tab.title,
        cpu: Math.round(5 + Math.random() * 35),
        ram: Math.round(40 + Math.random() * 260)
      }))
    };
  });

const generateThreatIndex = (extensions: ExtensionItem[]) => {
  if (!extensions.length) return 0;
  const totalRisk = extensions.reduce(
    (sum, extension) =>
      sum +
      extension.permissions.reduce((innerSum, permission) => innerSum + permission.risk, 0),
    0
  );
  return Math.round(totalRisk / extensions.length);
};

const App = () => {
  const [activeView, setActiveView] = useState<ViewKey>("dashboard");
  const [extensions, setExtensions] = useState<ExtensionItem[]>([]);
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [selectedExtensionId, setSelectedExtensionId] = useState<string | null>(null);
  const [auditOutput, setAuditOutput] = useState<string>(
    "Sélectionnez une extension pour démarrer l'audit paranoïaque."
  );
  const [auditLoading, setAuditLoading] = useState(false);

  const activeExtensions = useMemo(
    () => extensions.filter((extension) => extension.enabled),
    [extensions]
  );
  const threatIndex = useMemo(() => generateThreatIndex(extensions), [extensions]);
  const totalMemory = useMemo(
    () =>
      Math.round(
        extensions.reduce((sum, extension) => sum + (extension.enabled ? 120 : 40), 0)
      ),
    [extensions]
  );

  const resourceImpact = useMemo(
    () => buildResourceImpact(extensions, tabs),
    [extensions, tabs]
  );

  useEffect(() => {
    const load = async () => {
      const [extensionsData, tabsData] = await Promise.all([
        obtenirExtensions(),
        obtenirTabs()
      ]);
      setExtensions(extensionsData);
      setTabs(tabsData);
      if (!selectedExtensionId && extensionsData.length) {
        setSelectedExtensionId(extensionsData[0].id);
      }
    };

    load();
  }, [selectedExtensionId]);

  useEffect(() => {
    if (activeView !== "tabs") return;

    const interval = setInterval(async () => {
      const tabsData = await obtenirTabs();
      setTabs(tabsData);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeView]);

  const handleToggleAll = async (enabled: boolean) => {
    await Promise.all(
      extensions.map((extension) => activerExtension(extension.id, enabled))
    );
    setExtensions((prev) =>
      prev.map((extension) => ({ ...extension, enabled }))
    );
  };

  const handleToggleOne = async (id: string, enabled: boolean) => {
    await activerExtension(id, enabled);
    setExtensions((prev) =>
      prev.map((extension) =>
        extension.id === id ? { ...extension, enabled } : extension
      )
    );
  };

  const handleAudit = async (extension: ExtensionItem) => {
    setAuditLoading(true);
    setAuditOutput("> Connexion au noyau Gemini...\n> Synchronisation des métadonnées...\n> Analyse des permissions en cours...");

    const response = `# Rapport ExoCore\n\n## Extension auditée\n**${extension.name}** (${extension.version})\n\n## Surface d'attaque\n- Permissions critiques: ${extension.permissions
      .map((permission) => permission.name)
      .join(", ")}\n- Risque estimé: **${threatIndex}/10**\n\n## Vie privée\nCette extension peut observer des flux sensibles si elle reste activée en permanence.\n\n## Verdict\n**${extension.permissions.some((permission) => permission.risk > 4) ? "PURGER" : "GARDER"}**\n`;

    let cursor = 0;
    const typeInterval = setInterval(() => {
      cursor += 6;
      setAuditOutput(response.slice(0, cursor));
      if (cursor >= response.length) {
        clearInterval(typeInterval);
        setAuditLoading(false);
      }
    }, 35);
  };

  const sortedTabs = useMemo(
    () =>
      [...tabs]
        .map((tab) => ({
          ...tab,
          cpu: Math.round(3 + Math.random() * 55),
          memory: Math.round(50 + Math.random() * 450)
        }))
        .sort((a, b) => b.memory - a.memory),
    [tabs]
  );

  return (
    <div className="min-h-screen bg-exo-bg text-slate-100">
      <div className="flex gap-6 p-6">
        <aside className="w-72 space-y-6">
          <div className="glass-panel p-6">
            <div className="space-y-2">
              <h1 className="neon-title text-3xl">ExoCore</h1>
              <p className="text-sm text-slate-200">/ Roichi</p>
              <p className="text-xs text-slate-400">Hyperviseur v1.0</p>
            </div>
          </div>
          <nav className="glass-panel p-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveView(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl border border-slate-800 px-4 py-3 text-left text-sm transition hover:bg-slate-800/70 ${
                  activeView === item.key
                    ? "bg-slate-800/80 text-cyan-300"
                    : "text-slate-200"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">État système</span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                Actif / Protégé
              </span>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          {activeView === "dashboard" && (
            <section className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="glass-panel p-5">
                  <p className="text-xs uppercase text-slate-400">Modules actifs</p>
                  <p className="mt-3 text-3xl font-semibold text-cyan-300">
                    {activeExtensions.length}
                    <span className="text-base text-slate-500">/{extensions.length}</span>
                  </p>
                  <div className="mt-4 h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-cyan-400"
                      style={{
                        width: `${
                          extensions.length
                            ? (activeExtensions.length / extensions.length) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>
                <div className="glass-panel p-5">
                  <p className="text-xs uppercase text-slate-400">Mémoire totale</p>
                  <p className="mt-3 text-3xl font-semibold text-emerald-300">
                    {formatNumber(totalMemory)} Mo
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Estimation hybride (API privée indisponible).
                  </p>
                </div>
                <div className="glass-panel p-5">
                  <p className="text-xs uppercase text-slate-400">Indice de menace</p>
                  <p className="mt-3 text-3xl font-semibold text-rose-300">
                    {threatIndex}/10
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Calculé sur les permissions sensibles.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="glass-panel p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-200">
                      Charge mémoire
                    </h2>
                    <span className="text-xs text-slate-500">Historique simulé</span>
                  </div>
                  <div className="mt-4 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={memoryHistory}>
                        <Tooltip
                          contentStyle={{
                            background: "#0f172a",
                            border: "1px solid #1e293b",
                            borderRadius: "12px",
                            color: "#e2e8f0"
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="charge"
                          stroke="#38bdf8"
                          fill="#0ea5e9"
                          fillOpacity={0.25}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="glass-panel p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-200">
                      Types d'extensions
                    </h2>
                    <span className="text-xs text-slate-500">Répartition</span>
                  </div>
                  <div className="mt-4 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          contentStyle={{
                            background: "#0f172a",
                            border: "1px solid #1e293b",
                            borderRadius: "12px",
                            color: "#e2e8f0"
                          }}
                        />
                        <Pie
                          data={extensionTypes}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={45}
                          outerRadius={90}
                          fill="#22d3ee"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeView === "extensions" && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-rose-500/60 bg-rose-500/20 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/30"
                  onClick={() => handleToggleAll(false)}
                >
                  TOUT ARRÊTER
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-emerald-500/60 bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/30"
                  onClick={() => handleToggleAll(true)}
                >
                  TOUT ACTIVER
                </button>
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                {extensions.map((extension) => (
                  <div key={extension.id} className="glass-panel p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-800/80 p-2">
                        {extension.icon ? (
                          <img
                            src={extension.icon}
                            alt={extension.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-xl">🧩</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">
                              {extension.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              v{extension.version} · {extension.category}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              extension.enabled
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            {extension.enabled ? "Actif" : "Inactif"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {extension.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {extension.permissions.map((permission) => (
                            <span
                              key={permission.name}
                              className="rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-300"
                            >
                              {permission.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-3 pt-2">
                          <button
                            type="button"
                            className="rounded-lg border border-cyan-500/60 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200 transition hover:bg-cyan-500/20"
                            onClick={() => {
                              setActiveView("security");
                              setSelectedExtensionId(extension.id);
                              handleAudit(extension);
                            }}
                          >
                            Audit
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800/70"
                            onClick={() =>
                              handleToggleOne(extension.id, !extension.enabled)
                            }
                          >
                            {extension.enabled ? "Désactiver" : "Activer"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeView === "security" && (
            <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <div className="glass-panel p-4">
                <h2 className="text-sm font-semibold text-slate-200">
                  Extensions sous surveillance
                </h2>
                <div className="mt-4 space-y-2">
                  {extensions.map((extension) => (
                    <button
                      key={extension.id}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-left text-xs transition hover:bg-slate-800/70 ${
                        selectedExtensionId === extension.id
                          ? "bg-slate-800/80 text-cyan-200"
                          : "text-slate-300"
                      }`}
                      onClick={() => {
                        setSelectedExtensionId(extension.id);
                        handleAudit(extension);
                      }}
                    >
                      <span>{extension.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {extension.enabled ? "Actif" : "Inactif"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="glass-panel p-6 terminal-scanlines">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-techno text-lg text-emerald-300">
                    Console IA Gemini
                  </h2>
                  <span className="text-xs text-emerald-500">
                    {auditLoading ? "Analyse en cours..." : "Connexion stable"}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-black/80 p-4 text-sm text-emerald-200">
                  <pre className="whitespace-pre-wrap font-mono">
                    {auditOutput}
                  </pre>
                </div>
              </div>
            </section>
          )}

          {activeView === "tabs" && (
            <section className="glass-panel p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-200">
                  Gestionnaire de Processus Onglets
                </h2>
                <span className="text-xs text-slate-500">
                  Rafraîchissement auto 5s
                </span>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Processus</th>
                      <th className="px-4 py-3">Processeur</th>
                      <th className="px-4 py-3">Mémoire</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTabs.map((tab) => (
                      <tr
                        key={tab.id}
                        className="border-t border-slate-800/80 text-slate-200"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-800/70 p-1">
                              {tab.favIconUrl ? (
                                <img
                                  src={tab.favIconUrl}
                                  alt={tab.title}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <span>🌐</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-slate-100">
                                {tab.title}
                              </p>
                              <p className="text-xs text-slate-500">
                                {tab.url}
                              </p>
                            </div>
                            {tab.audible && (
                              <span className="text-lg">🔊</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-cyan-200">
                          {tab.cpu}%
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>{tab.memory} Mo</span>
                              <span>{Math.min(100, Math.round(tab.memory / 5))}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-800">
                              <div
                                className="h-2 rounded-full bg-rose-400"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.round(tab.memory / 5)
                                  )}%`
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              className="rounded-lg border border-cyan-500/60 px-3 py-1 text-xs text-cyan-200 transition hover:bg-cyan-500/10"
                              onClick={() => focusTab(tab.id)}
                            >
                              VOIR
                            </button>
                            <button
                              type="button"
                              className="rounded-lg border border-rose-500/60 px-3 py-1 text-xs text-rose-200 transition hover:bg-rose-500/10"
                              onClick={() => fermerOnglet(tab.id)}
                            >
                              TUER
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeView === "resources" && (
            <section className="glass-panel p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-200">
                  Moniteur Ressources Extensions
                </h2>
                <span className="text-xs text-slate-500">
                  Heuristique réaliste (simulation)
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {resourceImpact.map((impact) => (
                  <div
                    key={impact.extensionId}
                    className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-200">
                        {impact.extensionName}
                      </h3>
                      <span className="text-xs text-slate-500">
                        {impact.tabs.length} onglets impactés
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {impact.tabs.map((tab) => (
                        <div
                          key={tab.tabId}
                          className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800/70 px-3 py-2 text-xs text-slate-300"
                        >
                          <span>{tab.tabTitle}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-cyan-300">CPU {tab.cpu}%</span>
                            <span className="text-emerald-300">RAM {tab.ram} Mo</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
