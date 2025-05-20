/**
 * Utility functions for generating time-based greetings
 */

/**
 * Returns a greeting based on the current time of day
 * @param userName Optional user name to personalize the greeting
 * @returns A time-appropriate greeting string
 */
export function getTimeBasedGreeting(userName?: string): string {
  const currentHour = new Date().getHours();
  let greeting = '';

  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  if (userName) {
    greeting += `, ${userName}`;
  }

  return greeting;
}

/**
 * Returns a greeting with a random welcome message
 * @param userName Optional user name to personalize the greeting
 * @returns A greeting with a random welcome message
 */
export function getRandomWelcomeMessage(userName?: string): string {
  const welcomeMessages = [
    'Welcome to your dashboard',
    'Here\'s your dashboard overview',
    'Your communications at a glance',
    'Your platform overview',
    'Your communication hub'
  ];

  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
  const message = welcomeMessages[randomIndex];

  if (userName) {
    return `${getTimeBasedGreeting(userName)}! ${message}.`;
  }

  return `${getTimeBasedGreeting()}! ${message}.`;
}
