import { ImageWithFallback } from '../common/ImageWithFallback';

interface DashboardSectionProps {
  t: typeof import('../../lib/translations').translations.en;
}

export function DashboardSection({ t }: DashboardSectionProps) {
  const dashboards = [
    {
      title: t.wallet.mainInterface,
      description: t.wallet.mainInterfaceDesc,
      image:
        'https://images.unsplash.com/photo-1629963918958-1b62cfe3fe92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBkYXNoYm9hcmQlMjBhbmFseXRpY3N8ZW58MXx8fHwxNzYwOTk0Nzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: t.wallet.exploreInterface,
      description: t.wallet.exploreInterfaceDesc,
      image:
        'https://images.unsplash.com/photo-1724709162875-fe100dd0e04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwbWFuYWdlbWVudCUyMGludmVudG9yeXxlbnwxfHx8fDE3NjA5OTQ4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: t.wallet.nftInterface,
      description: t.wallet.nftInterfaceDesc,
      image:
        'https://images.unsplash.com/photo-1694153015244-c3f4da130d4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlwcGluZyUyMG9yZGVycyUyMHRyYWNraW5nfGVufDF8fHx8MTc2MDk5NDc5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-transparent to-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-foreground mb-4 md:mb-6 px-4">{t.wallet.title}</h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground-enhanced max-w-3xl lg:max-w-4xl mx-auto px-4">
            {t.wallet.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {dashboards.map((dashboard, index) => (
            <div key={index} className="liquid-card no-hover p-6 md:p-8 group">
              <div className="rounded-xl md:rounded-2xl overflow-hidden mb-6 aspect-[4/3]">
                <ImageWithFallback
                  src={dashboard.image}
                  alt={dashboard.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-foreground mb-3 text-lg md:text-xl">{dashboard.title}</h3>
              <p className="text-muted-foreground-enhanced text-sm md:text-base">
                {dashboard.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
