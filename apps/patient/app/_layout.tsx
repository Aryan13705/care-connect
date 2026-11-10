import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PatientProvider, usePatient } from '../src/context/PatientContext';

function RootLayoutContent() {
  const { theme, isDarkMode } = usePatient();

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
        <Stack.Screen name="specialities" options={{ title: 'All Specialities', headerBackTitle: 'Back' }} />
        <Stack.Screen name="doctor/[id]" options={{ title: 'Doctor Profile', headerBackTitle: 'Back' }} />
        <Stack.Screen name="booking/[id]" options={{ title: 'Book Consultation', headerBackTitle: 'Back' }} />
        <Stack.Screen name="booking-confirmation" options={{ headerShown: false }} />
        <Stack.Screen name="appointment/[id]" options={{ title: 'Appointment Details', headerBackTitle: 'Back' }} />
        <Stack.Screen name="consultation/[id]" options={{ title: 'Teleconsultation Room', headerBackTitle: 'Exit' }} />
        <Stack.Screen name="prescription/[id]" options={{ title: 'Digital Prescription', headerBackTitle: 'Back' }} />
        <Stack.Screen name="family" options={{ title: 'Family Health', headerBackTitle: 'Back' }} />
        <Stack.Screen name="notifications" options={{ title: 'Notifications', headerBackTitle: 'Back' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings', headerBackTitle: 'Back' }} />
        <Stack.Screen name="support" options={{ title: 'Help & Support', headerBackTitle: 'Back' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PatientProvider>
        <RootLayoutContent />
      </PatientProvider>
    </SafeAreaProvider>
  );
}
