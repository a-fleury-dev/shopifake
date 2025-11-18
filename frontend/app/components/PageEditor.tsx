import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface PageEditorProps {
  pageId: string;
  pageTitle: string;
  pageContent: string;
  onSave: (content: string) => void;
  onClose: () => void;
  isOpen: boolean;
  language: 'en' | 'fr';
}

export function PageEditor({
  pageTitle,
  pageContent,
  onSave,
  onClose,
  isOpen,
  language,
}: PageEditorProps) {
  const handleSave = () => {
    // TODO: Implement actual editor logic
    onSave(pageContent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{pageTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-4 bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'en'
              ? 'Page editor coming soon. This is a placeholder component.'
              : 'Éditeur de page à venir. Ceci est un composant temporaire.'}
          </p>
          <pre className="text-xs whitespace-pre-wrap">{pageContent}</pre>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            {language === 'en' ? 'Cancel' : 'Annuler'}
          </Button>
          <Button onClick={handleSave}>{language === 'en' ? 'Save' : 'Enregistrer'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
