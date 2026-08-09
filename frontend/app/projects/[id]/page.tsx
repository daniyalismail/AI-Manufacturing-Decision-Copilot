import { ProjectWorkspace } from './ProjectWorkspace';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="flex flex-col pt-4">
      <ProjectWorkspace projectId={resolvedParams.id} />
    </div>
  );
}
