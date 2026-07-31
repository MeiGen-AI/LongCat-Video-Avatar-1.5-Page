import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { FlatList, RefreshControl, Text } from 'react-native';
import { api } from '../../lib/api-client';
import { Card, Screen, Title, Body } from '../../components';
export default function Library() {
  const query = useQuery({ queryKey: ['generations'], queryFn: () => api.listGenerations() });
  const items =
    (
      query.data as
        | { items?: Array<{ id: string; title?: string; status: string; progress: number }> }
        | undefined
    )?.items ?? [];
  return (
    <Screen>
      <Title>Library</Title>
      <Body>Your finished and in-progress performances.</Body>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={query.isFetching} onRefresh={() => void query.refetch()} />
        }
        ListEmptyComponent={
          <Card>
            <Body>
              {query.isLoading
                ? 'Loading your library…'
                : 'Your first performance will appear here.'}
            </Body>
          </Card>
        }
        renderItem={({ item }) => (
          <Link href={`/generation/${item.id}`} asChild>
            <Card>
              <Text style={{ color: '#F6F0E7', fontWeight: '700' }}>
                {item.title ?? 'Untitled performance'}
              </Text>
              <Body>
                {item.status} · {item.progress}%
              </Body>
            </Card>
          </Link>
        )}
      />
    </Screen>
  );
}
