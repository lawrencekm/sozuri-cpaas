import { useState, useEffect } from 'react';

export type OnboardingStatus = 'new' | 'in_progress' | 'remind_later' | 'completed';

interface OnboardingPreferences {
  status: OnboardingStatus;
  lastInteraction: string | null;
  remindLaterDate: string | null;
  completedSteps: string[];
}

const DEFAULT_PREFERENCES: OnboardingPreferences = {
  status: 'new',
  lastInteraction: null,
  remindLaterDate: null,
  completedSteps: [],
};

interface UseOnboardingPreferencesOptions {
  storageKey: string;
  remindLaterDays?: number;
}

export function useOnboardingPreferences({
  storageKey,
  remindLaterDays = 7,
}: UseOnboardingPreferencesOptions) {
  const [preferences, setPreferences] = useState<OnboardingPreferences>(DEFAULT_PREFERENCES);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState<boolean>(false);

  useEffect(() => {
    const loadPreferences = () => {
      try {
        const savedPreferences = localStorage.getItem(storageKey);
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      } catch (error) {
        console.error('Error loading onboarding preferences:', error);
        // If there's an error, reset to default
        setPreferences(DEFAULT_PREFERENCES);
      }
    };

    loadPreferences();
  }, [storageKey]);

  useEffect(() => {
    const determineOnboardingVisibility = () => {
      // If user has completed onboarding, don't show it
      if (preferences.status === 'completed') {
        setShouldShowOnboarding(false);
        return;
      }

      // If user is new or in progress, show onboarding
      if (preferences.status === 'new' || preferences.status === 'in_progress') {
        setShouldShowOnboarding(true);
        return;
      }

      // If user clicked "remind later", check if the remind later date has passed
      if (preferences.status === 'remind_later' && preferences.remindLaterDate) {
        const remindDate = new Date(preferences.remindLaterDate);
        const now = new Date();
        
        // If the remind later date has passed, show onboarding
        if (now >= remindDate) {
          setShouldShowOnboarding(true);
          updatePreferences({ status: 'in_progress', remindLaterDate: null });
        } else {
          setShouldShowOnboarding(false);
        }
        return;
      }

      setShouldShowOnboarding(false);
    };

    determineOnboardingVisibility();
  }, [preferences]);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: OnboardingPreferences) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Error saving onboarding preferences:', error);
    }
  };

  // Update preferences
  const updatePreferences = (updates: Partial<OnboardingPreferences>) => {
    const newPreferences = {
      ...preferences,
      ...updates,
      lastInteraction: new Date().toISOString(),
    };
    
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  // Mark onboarding as completed
  const completeOnboarding = () => {
    updatePreferences({
      status: 'completed',
      remindLaterDate: null,
    });
    setShouldShowOnboarding(false);
  };

  // Set remind later
  const remindLater = () => {
    const remindDate = new Date();
    remindDate.setDate(remindDate.getDate() + remindLaterDays);
    
    updatePreferences({
      status: 'remind_later',
      remindLaterDate: remindDate.toISOString(),
    });
    
    setShouldShowOnboarding(false);
  };

  // Mark a step as completed
  const completeStep = (stepId: string) => {
    if (!preferences.completedSteps.includes(stepId)) {
      const newCompletedSteps = [...preferences.completedSteps, stepId];
      updatePreferences({
        status: 'in_progress',
        completedSteps: newCompletedSteps,
      });
    }
  };

  // Reset onboarding (for testing purposes)
  const resetOnboarding = () => {
    updatePreferences({
      ...DEFAULT_PREFERENCES,
      status: 'new',
    });
    setShouldShowOnboarding(true);
  };

  return {
    preferences,
    shouldShowOnboarding,
    completeOnboarding,
    remindLater,
    completeStep,
    resetOnboarding,
  };
}
