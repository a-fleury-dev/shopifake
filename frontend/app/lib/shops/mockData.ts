import type { Shop } from './types';

export const mockShops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Fashion Paradise',
    domain: 'fashionparadise',
    banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3RvcmV8ZW58MXx8fHwxNzYwOTk0Nzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium fashion and accessories store',
    createdAt: '2024-01-15',
    userRole: 'admin',
    collaborators: [
      {
        email: 'manager@fashionparadise.com',
        role: 'manager',
        name: 'Sarah Johnson',
        addedAt: '2024-01-20'
      },
      {
        email: 'reader@fashionparadise.com',
        role: 'reader',
        name: 'Mike Chen',
        addedAt: '2024-02-01'
      }
    ],
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      language: 'en'
    }
  },
  {
    id: 'shop-2',
    name: 'Tech Gadgets Pro',
    domain: 'techgadgets',
    banner: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RvcmV8ZW58MXx8fHwxNzYwOTk0Nzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Latest technology and gadgets',
    createdAt: '2024-02-10',
    userRole: 'manager',
    collaborators: [
      {
        email: 'admin@techgadgets.com',
        role: 'admin',
        name: 'John Smith',
        addedAt: '2024-02-10'
      }
    ],
    settings: {
      currency: 'EUR',
      timezone: 'Europe/Paris',
      language: 'en'
    }
  },
  {
    id: 'shop-3',
    name: 'Organic Food Market',
    domain: 'organicfood',
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZm9vZCUyMHN0b3JlfGVufDF8fHx8MTc2MDk5NDc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Fresh organic produce and healthy foods',
    createdAt: '2024-03-01',
    userRole: 'admin',
    collaborators: [
      {
        email: 'sales@organicfood.com',
        role: 'manager',
        name: 'Emma Davis',
        addedAt: '2024-03-05'
      },
      {
        email: 'analyst@organicfood.com',
        role: 'reader',
        name: 'David Martinez',
        addedAt: '2024-03-10'
      }
    ],
    settings: {
      currency: 'USD',
      timezone: 'America/Los_Angeles',
      language: 'en'
    }
  },
  {
    id: 'shop-4',
    name: 'Home Decor Studio',
    domain: 'homedecor',
    banner: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3IlMjBzdG9yZXxlbnwxfHx8fDE3NjA5OTQ3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Beautiful home decoration and furniture',
    createdAt: '2024-03-15',
    userRole: 'reader',
    collaborators: [
      {
        email: 'owner@homedecor.com',
        role: 'admin',
        name: 'Lisa Anderson',
        addedAt: '2024-03-15'
      },
      {
        email: 'manager@homedecor.com',
        role: 'manager',
        name: 'Tom Wilson',
        addedAt: '2024-03-20'
      }
    ],
    settings: {
      currency: 'GBP',
      timezone: 'Europe/London',
      language: 'en'
    }
  },
  {
    id: 'shop-5',
    name: 'Sports & Fitness Hub',
    domain: 'sportsfitness',
    banner: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdG9yZXxlbnwxfHx8fDE3NjA5OTQ3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium sports equipment and fitness gear',
    createdAt: '2024-04-01',
    userRole: 'manager',
    collaborators: [
      {
        email: 'ceo@sportsfitness.com',
        role: 'admin',
        name: 'Alex Brown',
        addedAt: '2024-04-01'
      }
    ],
    settings: {
      currency: 'CAD',
      timezone: 'America/Toronto',
      language: 'en'
    }
  }
];
