import { StatCard } from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MessageCircle, Users, Clock, ThumbsUp } from 'lucide-react';

interface ChatbotViewProps {
  language: 'en' | 'fr';
  translations: any;
}

const chatbotConversationsData = [
  { day: 'Mon', conversations: 245, resolved: 218, avgTime: 3.1 },
  { day: 'Tue', conversations: 312, resolved: 289, avgTime: 2.9 },
  { day: 'Wed', conversations: 289, resolved: 267, avgTime: 3.2 },
  { day: 'Thu', conversations: 356, resolved: 324, avgTime: 3.0 },
  { day: 'Fri', conversations: 398, resolved: 361, avgTime: 3.4 },
  { day: 'Sat', conversations: 187, resolved: 172, avgTime: 2.8 },
  { day: 'Sun', conversations: 156, resolved: 145, avgTime: 2.7 },
];

const chatbotUserActivityData = [
  { date: 'Day 1', activeUsers: 856, newUsers: 45 },
  { date: 'Day 5', activeUsers: 1045, newUsers: 67 },
  { date: 'Day 10', activeUsers: 1234, newUsers: 78 },
  { date: 'Day 15', activeUsers: 1356, newUsers: 85 },
  { date: 'Day 20', activeUsers: 1312, newUsers: 82 },
  { date: 'Day 25', activeUsers: 1401, newUsers: 91 },
  { date: 'Day 30', activeUsers: 1423, newUsers: 94 },
];

const chatbotTopTopics = [
  { topic: 'Product Questions', count: 342, percentage: 38, color: 'from-blue-500 to-blue-600' },
  { topic: 'Shipping Info', count: 287, percentage: 32, color: 'from-green-500 to-green-600' },
  {
    topic: 'Returns & Refunds',
    count: 156,
    percentage: 17,
    color: 'from-orange-500 to-orange-600',
  },
  { topic: 'Account Issues', count: 98, percentage: 11, color: 'from-purple-500 to-purple-600' },
  { topic: 'Payment Problems', count: 18, percentage: 2, color: 'from-red-500 to-red-600' },
];

export function ChatbotView({ language, translations }: ChatbotViewProps) {
  const dt = translations;

  const totalConversations = chatbotConversationsData.reduce(
    (sum, item) => sum + item.conversations,
    0,
  );
  const avgResponseTime = (
    chatbotConversationsData.reduce((sum, item) => sum + item.avgTime, 0) /
    chatbotConversationsData.length
  ).toFixed(1);
  const totalResolved = chatbotConversationsData.reduce((sum, item) => sum + item.resolved, 0);
  const satisfactionRate = ((totalResolved / totalConversations) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <h1 className="text-foreground">{dt.chatbot.title}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title={dt.chatbot.totalConversations}
          value={totalConversations.toLocaleString()}
          icon={MessageCircle}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatCard
          title={dt.chatbot.activeUsers}
          value="1,423"
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title={dt.chatbot.avgResponseTime}
          value={`${avgResponseTime}s`}
          icon={Clock}
          trend={{ value: 12.5, isPositive: false }}
        />
        <StatCard
          title={dt.chatbot.satisfactionRate}
          value={`${satisfactionRate}%`}
          icon={ThumbsUp}
          trend={{ value: 5.4, isPositive: true }}
        />
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="ios-surface border-0 p-1 h-auto rounded-2xl">
          <TabsTrigger value="analytics" className="rounded-xl px-6 py-3">
            {dt.chatbot.analytics}
          </TabsTrigger>
          <TabsTrigger value="conversations" className="rounded-xl px-6 py-3">
            {dt.chatbot.conversations}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Conversations Chart */}
          <Card className="liquid-card">
            <CardHeader>
              <CardTitle>{dt.chatbot.conversationsByDay}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chatbotConversationsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="conversations"
                    fill="hsl(var(--primary))"
                    name={language === 'en' ? 'Total' : 'Total'}
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="resolved"
                    fill="hsl(var(--chart-2))"
                    name={language === 'en' ? 'Resolved' : 'Résolues'}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Activity Chart */}
          <Card className="liquid-card">
            <CardHeader>
              <CardTitle>{dt.chatbot.userActivity}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chatbotUserActivityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name={language === 'en' ? 'Active Users' : 'Utilisateurs Actifs'}
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    name={language === 'en' ? 'New Users' : 'Nouveaux'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Topics */}
          <Card className="liquid-card">
            <CardHeader>
              <CardTitle>{dt.chatbot.topTopics}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chatbotTopTopics.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{topic.topic}</span>
                      <span className="text-sm text-muted-foreground">
                        {topic.count} ({topic.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${topic.color} rounded-full`}
                        style={{ width: `${topic.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations">
          <Card className="liquid-card">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Recent Conversations' : 'Conversations Récentes'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-12">
                {language === 'en'
                  ? 'Conversation list coming soon...'
                  : 'Liste des conversations à venir...'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
