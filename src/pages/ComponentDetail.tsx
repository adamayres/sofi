import { useParams } from 'react-router-dom';

export function ComponentDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Component: {id}</h1>
      <p className="text-muted-foreground">
        Build the component detail page here. See SPEC.md for requirements.
      </p>
    </div>
  );
}
