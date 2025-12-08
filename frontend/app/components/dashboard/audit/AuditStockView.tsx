import { useState } from 'react';
import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Package, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

interface StockViewProps {
  language: 'en' | 'fr';
  translations: any;
}

// Mock data for stock actions
const stockActions = [
  { id: 1, sku: 'TSH-001', quantity: 50, date: '2024-12-03 14:30', type: 'in' },
  { id: 2, sku: 'JNS-002', quantity: -15, date: '2024-12-03 13:15', type: 'out' },
  { id: 3, sku: 'DRS-003', quantity: 100, date: '2024-12-03 11:45', type: 'in' },
  { id: 4, sku: 'JKT-004', quantity: -8, date: '2024-12-03 10:20', type: 'out' },
  { id: 5, sku: 'SHO-005', quantity: 75, date: '2024-12-02 16:50', type: 'in' },
  { id: 6, sku: 'SWT-006', quantity: -22, date: '2024-12-02 15:30', type: 'out' },
  { id: 7, sku: 'TSH-001', quantity: -12, date: '2024-12-02 14:10', type: 'out' },
  { id: 8, sku: 'JNS-002', quantity: 200, date: '2024-12-02 12:00', type: 'in' },
  { id: 9, sku: 'DRS-003', quantity: -5, date: '2024-12-01 17:25', type: 'out' },
  { id: 10, sku: 'JKT-004', quantity: 30, date: '2024-12-01 16:15', type: 'in' },
  { id: 11, sku: 'SHO-005', quantity: -18, date: '2024-12-01 15:00', type: 'out' },
  { id: 12, sku: 'SWT-006', quantity: 150, date: '2024-12-01 13:45', type: 'in' },
  { id: 13, sku: 'TSH-001', quantity: -25, date: '2024-12-01 12:30', type: 'out' },
  { id: 14, sku: 'JNS-002', quantity: -9, date: '2024-12-01 11:20', type: 'out' },
  { id: 15, sku: 'DRS-003', quantity: 80, date: '2024-12-01 10:10', type: 'in' },
  { id: 16, sku: 'JKT-004', quantity: -14, date: '2024-11-30 16:40', type: 'out' },
  { id: 17, sku: 'SHO-005', quantity: 120, date: '2024-11-30 15:30', type: 'in' },
  { id: 18, sku: 'SWT-006', quantity: -30, date: '2024-11-30 14:20', type: 'out' },
  { id: 19, sku: 'TSH-001', quantity: 90, date: '2024-11-30 13:10', type: 'in' },
  { id: 20, sku: 'JNS-002', quantity: -7, date: '2024-11-30 12:00', type: 'out' },
  { id: 21, sku: 'DRS-003', quantity: -11, date: '2024-11-29 17:50', type: 'out' },
  { id: 22, sku: 'JKT-004', quantity: 45, date: '2024-11-29 16:40', type: 'in' },
  { id: 23, sku: 'SHO-005', quantity: -20, date: '2024-11-29 15:30', type: 'out' },
  { id: 24, sku: 'SWT-006', quantity: 110, date: '2024-11-29 14:20', type: 'in' },
  { id: 25, sku: 'TSH-001', quantity: -16, date: '2024-11-29 13:10', type: 'out' },
];

const ITEMS_PER_PAGE = 10;

export function StockView({ language, translations }: StockViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const dt = translations;

  // Calculate stock statistics
  const totalUnits = 1247; // Mock total
  const totalValue = 56320; // Mock value in currency
  
  // Pagination logic
  const totalPages = Math.ceil(stockActions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentActions = stockActions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">{dt.stock.title}</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title={language === 'en' ? 'Total Units in Stock' : 'Unités Totales en Stock'}
          value={totalUnits.toLocaleString()}
          icon={Package}
        />
        <StatCard
          title={language === 'en' ? 'Total Stock Value' : 'Valeur Totale du Stock'}
          value={`$${totalValue.toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      {/* Stock Actions Table */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Recent Stock Actions' : 'Actions de Stock Récentes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>{language === 'en' ? 'Quantity' : 'Quantité'}</TableHead>
                <TableHead>{language === 'en' ? 'Date' : 'Date'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="font-mono text-sm">{action.sku}</TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${
                        action.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {action.quantity > 0 ? '+' : ''}{action.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{action.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'Page' : 'Page'} {currentPage} {language === 'en' ? 'of' : 'sur'} {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {language === 'en' ? 'Previous' : 'Précédent'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                {language === 'en' ? 'Next' : 'Suivant'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
