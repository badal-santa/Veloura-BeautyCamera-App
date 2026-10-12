import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { Image, Text, View } from 'react-native';

import { TEMPLATES } from '../../data/templates';
import { FILTERS } from '../../features/beauty/types';
import { listCreations } from '../../features/media/creations';

/** Avatar + stats header for the profile. */
export default function IdentityCard() {
  const [creations, setCreations] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setCreations(listCreations().length);
    }, []),
  );

  const stats = [
    { value: creations, label: 'Creations' },
    { value: TEMPLATES.length, label: 'Templates' },
    { value: FILTERS.length, label: 'Filters' },
  ];

  return (
    <View className="mx-5 items-center overflow-hidden rounded-[32px] border border-white/10 px-5 pb-5 pt-7">
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.30)', 'rgba(255, 79, 163, 0.14)', 'rgba(25, 21, 34, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <LinearGradient
        colors={['#FFB38A', '#FF4FA3', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-[92px] w-[92px] items-center justify-center rounded-full"
      >
        <View className="h-[84px] w-[84px] items-center justify-center rounded-full bg-background">
          <Image source={require('../../../assets/images/logo.png')} className="h-[76px] w-[76px] rounded-full" />
        </View>
      </LinearGradient>
      <Text numberOfLines={1} className="mt-3 w-full text-center font-extrabold text-xl leading-7 text-white">
        Veloura creator
      </Text>
      <View className="mt-1.5 flex-row items-center rounded-full bg-emerald-400/15 px-3 py-1">
        <View className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <Text className="ml-1.5 font-semibold text-[11px] text-emerald-300">Private · everything stays on device</Text>
      </View>

      <View className="mt-5 w-full flex-row rounded-[22px] bg-black/30 py-3.5">
        {stats.map((s, i) => (
          <View key={s.label} className={`flex-1 items-center ${i > 0 ? 'border-l border-white/10' : ''}`}>
            <Text className="font-extrabold text-xl text-white">{s.value}</Text>
            <Text className="mt-0.5 font-medium text-[11px] text-white/50">{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
