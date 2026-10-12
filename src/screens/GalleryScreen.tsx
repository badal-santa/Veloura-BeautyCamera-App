import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import CreationsGrid from '../components/gallery/CreationsGrid';
import PickFromPhoneCard from '../components/gallery/PickFromPhoneCard';
import GlowBackdrop from '../components/GlowBackdrop';
import PressableScale from '../components/PressableScale';
import SectionTitle from '../components/SectionTitle';
import StatusBarFade from '../components/StatusBarFade';
import { deleteCreation, listCreations } from '../features/media/creations';
import { useOpenEditor } from '../features/media/useOpenEditor';
import type { RootStackScreenProps } from '../navigation/types';

export default function GalleryScreen({ navigation }: RootStackScreenProps<'Gallery'>) {
  const openEditor = useOpenEditor();
  const [creations, setCreations] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      setCreations(listCreations());
    }, []),
  );

  const confirmDelete = (uri: string) =>
    Alert.alert('Delete this creation?', 'It will be removed from Veloura. Copies in your phone gallery stay.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteCreation(uri);
          setCreations(listCreations());
        },
      },
    ]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <GlowBackdrop color="rgba(168, 85, 247, 0.22)" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-safe-offset-3 pb-safe-offset-10">
        <Animated.View entering={FadeInDown.duration(500)} className="flex-row items-center px-5">
          <PressableScale
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-full border border-border bg-white/10"
          >
            <MaterialCommunityIcons name="arrow-left" className="text-[22px] text-content-primary" />
          </PressableScale>
          <View className="ml-3">
            <Text className="font-extrabold text-[28px] leading-[34px] text-content-primary">Gallery</Text>
            <Text className="font-regular text-[13px] text-content-secondary">Your creations, ready to edit</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)} className="mt-6">
          <PickFromPhoneCard onPress={() => openEditor()} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <SectionTitle title={`My creations${creations.length ? ` · ${creations.length}` : ''}`} />
          <CreationsGrid
            uris={creations}
            onOpen={(uri) => navigation.navigate('PhotoReview', { uri, source: 'creation' })}
            onDelete={confirmDelete}
            onEmptyAction={() => navigation.navigate('Capture')}
          />
        </Animated.View>
      </ScrollView>

      <StatusBarFade />
    </View>
  );
}
