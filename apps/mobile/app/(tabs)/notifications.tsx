import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { Card, Screen, Title, Body } from '../../components';
export default function Notifications() {
  const query = useQuery({ queryKey: ['notifications'], queryFn: api.notifications });
  const items =
    (query.data as { items?: Array<{ title: string; body: string }> } | undefined)?.items ?? [];
  return (
    <Screen>
      <Title>Notifications</Title>
      {items.length ? (
        items.map((item, index) => (
          <Card key={`${item.title}-${index}`}>
            <Title small>{item.title}</Title>
            <Body>{item.body}</Body>
          </Card>
        ))
      ) : (
        <Card>
          <Body>{query.isLoading ? 'Loading notifications…' : 'You are all caught up.'}</Body>
        </Card>
      )}
    </Screen>
  );
}
