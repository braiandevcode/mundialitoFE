/*
  Página de ranking de jugadores.
  - Muestro tabs por ronda (Global, J1, J2, J3) como chips horizontales scrolleables.
  - Tabla con posición, nombre, puntos y promedio de aciertos.
  - Las primeras 3 posiciones tienen medallas emoji.
  - Los datos vienen del hook useRanking (mock con delay simulado).
*/
import { useState } from "react";
import { ChevronLeft, ChevronRight, Globe, CalendarDays } from "lucide-react";
import { useAuth } from "@/shared/providers";
import { useRanking } from "@/module/ranking/hooks/useRanking";
import SEOHead from "@/shared/seo/SEOHead";
import Card from "@/shared/components/Card";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import ErrorState from "@/shared/components/ErrorState";
import Button from "@/shared/components/Button";
import { cn } from "@/core/utils";
import type { IRankingRound, IRankingEntry } from "@/core/types";
import type { LucideIcon } from "lucide-react";

const PER_PAGE = 10;

export default function RankingPage() {
  const { user } = useAuth();
  const {
    rounds,
    activeRound,
    setActiveRound,
    entries,
    isLoading,
    error,
    refetch,
  } = useRanking();
  const [page, setPage] = useState<number>(0);

  const totalPages: number = Math.ceil(entries.length / PER_PAGE);
  const globalIdx: number = page * PER_PAGE;
  const paginatedEntries: IRankingEntry[] = entries.slice(
    globalIdx,
    globalIdx + PER_PAGE,
  );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (error)
    return (
      <ErrorState
        title="Algo salió mal"
        message={error}
        action={
          <Button variant="secondary" onClick={refetch}>
            Reintentar
          </Button>
        }
      />
    );

  if (paginatedEntries.length === 0) {
    return (
      <>
        <Card padding={"lg"} className="flex overflow-hidden">
          <div className="overflow-x-auto text-amber-300 font-bold">La tabla sera cargada al finalizar la jornada...</div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Ranking | MundialitoApp"
        description="Consultá el ranking global de pronosticadores del Mundial 2026. ¿Quién va primero?"
      />
      <section>
        <h1 className="text-xl sm:text-2xl font-display text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-wider">
          Ranking
        </h1>

        {/* Tabs de rondas */}
        <div className="flex flex-wrap gap-1 mb-4 overflow-x-auto mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none">
          {rounds.map((r: IRankingRound) => {
            const Icon: LucideIcon = r.id === "global" ? Globe : CalendarDays;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRound(r.id);
                  setPage(0);
                }}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5",
                  activeRound === r.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-700 border border-slate-200 dark:border-neutral-700",
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Tabla de posiciones */}
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[320px]">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-neutral-600">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400 w-10 sm:w-12">
                    #
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
                    Jugador
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400 w-14 sm:w-16">
                    Pts
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400 w-20 sm:w-24">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map((entry: IRankingEntry, idx: number) => {
                  const position: number = globalIdx + idx;
                  const isFirst: boolean = position === 0;
                  const isCurrentUser: boolean = user?.id === entry.userId;

                  return (
                    <tr
                      key={entry.userId}
                      className={cn(
                        "border-b border-slate-100 dark:border-neutral-800 last:border-0 transition-colors",
                        "hover:bg-slate-50 dark:hover:bg-neutral-800/50",
                        "animate-fade-in",
                        isCurrentUser &&
                          "bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30",
                        !isCurrentUser &&
                          isFirst &&
                          "bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
                      )}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <td className="px-3 sm:px-4 py-3 text-center">
                        {isFirst ? (
                          <span className="text-base sm:text-lg">🥇</span>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">
                            {position + 1}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3 font-medium text-slate-800 dark:text-neutral-200">
                        {entry.userName}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right font-bold text-green-600 dark:text-green-400 tabular-nums">
                        {entry.totalPoints}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right text-slate-600 dark:text-neutral-400 font-mono tabular-nums text-xs sm:text-sm">
                        {entry.successRate.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              onClick={() => setPage((p: number) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                "text-slate-500 dark:text-neutral-400",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "hover:bg-slate-100 dark:hover:bg-neutral-800",
              )}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i: number) => i).map(
              (p: number) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all duration-200",
                    p === page
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                      : "bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-700",
                  )}
                >
                  {p + 1}
                </button>
              ),
            )}

            <button
              onClick={() =>
                setPage((p: number) => Math.min(totalPages - 1, p + 1))
              }
              disabled={page === totalPages - 1}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                "text-slate-500 dark:text-neutral-400",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "hover:bg-slate-100 dark:hover:bg-neutral-800",
              )}
              aria-label="Siguiente página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeRound !== "global" && (
          <p className="mt-4 text-xs text-slate-400 dark:text-neutral-500 text-center">
            Resultados parciales de{" "}
            {rounds.find((r: IRankingRound) => r.id === activeRound)?.label}
          </p>
        )}
      </section>
    </>
  );
}
