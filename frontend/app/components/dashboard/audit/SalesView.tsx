interface SalesViewProps {
  language: 'en' | 'fr';
  translations: any;
}

export function SalesView({ language }: SalesViewProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-2xl text-muted-foreground font-semibold">
          {language === 'fr' ? 'À implémenter' : 'To be implemented'}
        </p>
      </div>
    </div>
  );
}
