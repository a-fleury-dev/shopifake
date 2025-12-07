/**
 * AuditView Component
 * Displays stock action history with pagination (10 items per page)
 */

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Package, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { fetchStockSummary, type StockActionDTO, type StockSummaryDTO } from '../../../clients/storefrontApiClient';

interface AuditViewProps {
  shopId: number;
  language: 'en' | 'fr';
}

const ITEMS_PER_PAGE = 10;

const translations = {
  en: {
    title: 'Stock Audit',
    loading: 'Loading audit history...',
    error: 'Failed to load audit history',
    noActions: 'No stock actions recorded yet',
    actionType: 'Action',
    sku: 'SKU',
    quantity: 'Quantity',
    timestamp: 'Date & Time',
    add: 'Stock Added',
    remove: 'Stock Removed',
    page: 'Page',
    of: 'of',
    showing: 'Showing',
    to: 'to',
    entries: 'entries',
    totalEntries: 'Total entries',
  },
  fr: {
    title: 'Audit du Stock',
    loading: 'Chargement de l\'historique...',
    error: 'Échec du chargement de l\'historique',
    noActions: 'Aucune action de stock enregistrée',
    actionType: 'Action',
    sku: 'SKU',
    quantity: 'Quantité',
    timestamp: 'Date & Heure',
    add: 'Stock Ajouté',
    remove: 'Stock Retiré',
    page: 'Page',
    of: 'sur',
    showing: 'Affichage',
    to: 'à',
    entries: 'entrées',
    totalEntries: 'Entrées totales',
  },
};

export default function AuditView({ shopId, language }: AuditViewProps) {
  const t = translations[language];
  const [summary, setSummary] = useState<StockSummaryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadStockHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchStockSummary(shopId);
      setSummary(data);
    } catch (err) {
      console.error('Failed to load stock history:', err);
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStockHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-destructive">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!summary || summary.recentActions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t.noActions}</p>
        </div>
      </div>
    );
  }

  const actions = summary.recentActions;
  const totalPages = Math.ceil(actions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, actions.length);
  const currentActions = actions.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
        <p className="text-sm text-muted-foreground">
          {t.totalEntries}: {actions.length}
        </p>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="liquid-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold">{t.actionType}</th>
                <th className="text-left p-4 font-semibold">{t.sku}</th>
                <th className="text-left p-4 font-semibold">{t.quantity}</th>
                <th className="text-left p-4 font-semibold">{t.timestamp}</th>
              </tr>
            </thead>
            <tbody>
              {currentActions.map((action) => (
                <tr key={action.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {action.actionType === 'ADD' ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">{t.add}</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <span className="text-red-600 font-medium">{t.remove}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                      {action.sku}
                    </code>
                  </td>
                  <td className="p-4">
                    <span className={action.actionType === 'ADD' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {action.actionType === 'ADD' ? '+' : '-'}{action.quantity}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatDate(action.createdAt)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t.showing} {startIndex + 1} {t.to} {endIndex} {t.of} {actions.length} {t.entries}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="px-4 py-2 text-sm">
              {t.page} {currentPage} {t.of} {totalPages}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
