import { Stack, useLocalSearchParams } from 'expo-router';
import { createContext, useState, useEffect } from 'react';
import { fetchCommuneById } from '../../../services/api';

export const CommuneContext = createContext(null);

export default function CommuneLayout() {
  const { id } = useLocalSearchParams();
  const [commune, setCommune] = useState(null);

  useEffect(() => {
    if (!id) return;
    const loadCommune = async () => {
      try {
        const res = await fetchCommuneById(id);
        if (res?.data) {
          setCommune(res.data);
        }
      } catch (err) {
        console.error('Context error:', err);
      }
    };
    loadCommune();
  }, [id]);

  return (
    <CommuneContext.Provider value={commune}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="taxes" />
        <Stack.Screen name="agenda" />
        <Stack.Screen name="equipments" />
        <Stack.Screen name="about" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="procedures" />
        <Stack.Screen name="contacts" />
        <Stack.Screen name="news/index" />
        <Stack.Screen name="news/[newsId]" />
        <Stack.Screen name="business/register" />
        <Stack.Screen name="business/[businessId]" />
        <Stack.Screen name="menu" />
      </Stack>
    </CommuneContext.Provider>
  );
}
