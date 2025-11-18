import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';

interface HistoryViewProps {
  language: 'en' | 'fr';
  translations: any;
}

const mockAuditHistory = [
  {
    id: '1',
    date: '2025-10-28 14:32',
    user: 'John Admin',
    action: 'Updated Product: T-shirt #001, Price 19.99 → 21.99',
    status: 'success',
  },
  {
    id: '2',
    date: '2025-10-28 13:15',
    user: 'Sarah Manager',
    action: 'Added new product: Winter Jacket #045',
    status: 'success',
  },
  {
    id: '3',
    date: '2025-10-28 11:47',
    user: 'Mike Admin',
    action: 'Stock sync failed for SKU: HDN-003',
    status: 'failed',
  },
  {
    id: '4',
    date: '2025-10-28 10:22',
    user: 'John Admin',
    action: 'Updated Category: Electronics - Added 3 products',
    status: 'success',
  },
  {
    id: '5',
    date: '2025-10-27 16:58',
    user: 'Sarah Manager',
    action: 'Deleted Product: Old Stock Item #023',
    status: 'success',
  },
  {
    id: '6',
    date: '2025-10-27 15:12',
    user: 'Mike Admin',
    action: 'Bulk import completed: 127 products',
    status: 'success',
  },
  {
    id: '7',
    date: '2025-10-27 14:05',
    user: 'John Admin',
    action: 'Payment gateway configuration failed',
    status: 'failed',
  },
  {
    id: '8',
    date: '2025-10-27 12:30',
    user: 'Sarah Manager',
    action: 'Created new category: Accessories',
    status: 'success',
  },
];

export function HistoryView({ language, translations }: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const dt = translations;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: {
      [key: string]: { variant: 'default' | 'destructive' | 'secondary'; label: string };
    } = {
      success: { variant: 'default', label: dt.common.success },
      failed: { variant: 'destructive', label: dt.common.failed },
      pending: { variant: 'secondary', label: dt.common.pending },
    };
    const config = statusMap[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredHistory = mockAuditHistory.filter((item) => {
    const matchesSearch =
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground">{dt.history.title}</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={language === 'en' ? 'Search activities...' : 'Rechercher des activités...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 ios-surface border-0 rounded-2xl"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] ios-surface border-0 rounded-2xl">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder={dt.common.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'en' ? 'All Status' : 'Tous les Statuts'}
            </SelectItem>
            <SelectItem value="success">{dt.common.success}</SelectItem>
            <SelectItem value="failed">{dt.common.failed}</SelectItem>
            <SelectItem value="pending">{dt.common.pending}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity History Table */}
      <Card className="liquid-card">
        <CardHeader>
          <CardTitle>{dt.history.recentActions}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">{dt.audit.historyTable.date}</TableHead>
                <TableHead className="w-[150px]">{dt.audit.historyTable.user}</TableHead>
                <TableHead>{dt.audit.historyTable.action}</TableHead>
                <TableHead className="w-[120px] text-right">
                  {dt.audit.historyTable.status}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.date}
                  </TableCell>
                  <TableCell className="font-medium">{item.user}</TableCell>
                  <TableCell className="text-sm">{item.action}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredHistory.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {language === 'en' ? 'No activities found' : 'Aucune activité trouvée'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
