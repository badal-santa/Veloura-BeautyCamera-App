import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

import type { EditorTool } from '../../data/editor';
import PressableScale from '../PressableScale';

/** Horizontally scrolling pill buttons for quick tools. */
export default function ToolChips({ tools, onPress }: { tools: EditorTool[]; onPress: (tool: EditorTool) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2.5 px-5">
      {tools.map((tool) => (
        <PressableScale
          key={tool.label}
          onPress={() => onPress(tool)}
          accessibilityRole="button"
          accessibilityLabel={tool.label}
          className="flex-row items-center rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-1.5 pr-4"
        >
          <View className={`h-9 w-9 items-center justify-center rounded-full ${tool.badgeClass}`}>
            <MaterialCommunityIcons name={tool.icon} className={`text-lg ${tool.iconClass}`} />
          </View>
          <Text className="ml-2 font-semibold text-[13px] text-white">{tool.label}</Text>
          {tool.soon && <View className="ml-2 h-1.5 w-1.5 rounded-full bg-white/30" />}
        </PressableScale>
      ))}
    </ScrollView>
  );
}
