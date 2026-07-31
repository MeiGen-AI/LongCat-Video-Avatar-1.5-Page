import { GenerationPage } from '../../../components/app-pages';
export default function Generation({ params }: { params: { id: string } }) {
  return <GenerationPage id={params.id} />;
}
