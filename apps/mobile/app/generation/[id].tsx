import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { api } from '../../lib/api-client';
import { Card, Screen, Title, Body } from '../../components';
export default function GenerationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['generation', id],
    queryFn: () => api.getGeneration(id),
    enabled: Boolean(id),
    refetchInterval: 3000,
  });
  const generation = query.data as
    | { generation?: { title?: string; status: string; progress: number; output_url?: string } }
    | undefined;
  return (
    <Screen>
      <Title>{generation?.generation?.title ?? 'Performance'}</Title>
      {generation?.generation?.output_url ? (
        <Video
          source={{ uri: generation.generation.output_url }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          style={{ height: 220 }}
        />
      ) : (
        <Card>
          <Body>
            {generation?.generation?.status ?? 'Loading'} · {generation?.generation?.progress ?? 0}%
          </Body>
        </Card>
      )}
    </Screen>
  );
}
