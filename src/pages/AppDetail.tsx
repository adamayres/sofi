import { useParams } from 'react-router-dom';

export function AppDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">App: {id}</h1>
      <p className="text-muted-foreground">
        Build the app detail page here. See SPEC.md for requirements.
      </p>
    </div>
  );
}
