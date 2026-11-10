import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DoctorProvider, useDoctor } from '../src/context/DoctorContext';

function RootLayoutContent() {
  const { theme, isDarkMode } = useDoctor();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={theme.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="calendar" options={{ title: 'Schedule Calendar', headerBackTitle: 'Back' }} />
        <Stack.Screen name="appointment/[id]" options={{ title: 'Appointment Details', headerBackTitle: 'Back' }} />
        <Stack.Screen name="patient/[id]" options={{ title: 'Patient Clinical Profile', headerBackTitle: 'Back' }} />
        <Stack.Screen name="consultation/[id]" options={{ title: 'Clinical Teleconsultation Room', headerBackTitle: 'Exit' }} />
        <Stack.Screen name="consultation-notes/[id]" options={{ title: 'Consultation Notes Draft', headerBackTitle: 'Back' }} />
        <Stack.Screen name="prescription-composer/[id]" options={{ title: 'Prescription Composer', headerBackTitle: 'Back' }} />
        <Stack.Screen name="availability" options={{ title: 'Availability & Slot Management', headerBackTitle: 'Back' }} />
        <Stack.Screen name="earnings" options={{ title: 'Earnings & Payouts', headerBackTitle: 'Back' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings', headerBackTitle: 'Back' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DoctorProvider>
        <RootLayoutContent />
      </DoctorProvider>
    </SafeAreaProvider>
  );
}
