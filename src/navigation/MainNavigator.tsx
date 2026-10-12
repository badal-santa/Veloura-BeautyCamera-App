import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EditorScreen from '../screens/EditorScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import PressableScale from '../components/PressableScale';
import CameraTabButton from '../components/navigation/CameraTabButton';


export type MainTabParamList = {
  Home: undefined;
  Editor: undefined;
  Gallery: undefined;
  Camera: undefined;
  AI: undefined;
  Templates: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,

        tabBarStyle: {
          position: 'absolute',
          // Grow by the system inset so the bar clears the gesture / nav bar.
          height: 78 + insets.bottom,
          paddingTop: 10,
          paddingBottom: 10 + insets.bottom,
          paddingHorizontal: 8,

          backgroundColor: '#111019',

          borderTopWidth: 1,
          borderTopColor: '#2A2335',

          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },

        tabBarActiveTintColor: '#FF4FA3',
        tabBarInactiveTintColor: '#716A7C',
      }}
    >
      {/* Home */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Editor */}
      <Tab.Screen
        name="Editor"
        component={EditorScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'color-wand' : 'color-wand-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Gallery */}
      {/* <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'images' : 'images-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      /> */}

      {/* Camera — opens the full-screen camera instead of switching tabs */}
      <Tab.Screen
        name="Camera"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.getParent()?.navigate('Capture');
          },
        })}
        options={{
          tabBarLabel: () => null,
          tabBarButton: ({ onPress }) => (
            <PressableScale
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel="Open camera"
              pressedScale={0.9}
              className="flex-1 items-center"
            >
              <CameraTabButton />
            </PressableScale>
          ),
        }}
      />

      {/* Templates */}
      <Tab.Screen
        name="Templates"
        component={TemplatesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={21}
              color={color}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Placeholder for the Camera tab route — never shown (press opens Capture).
const EmptyScreen = () => null;

export default MainNavigator;