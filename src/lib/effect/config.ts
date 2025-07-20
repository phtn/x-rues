/**
 * Effect Configuration
 *
 * This file contains configuration settings for the Effect library.
 * It sets up global configurations and exports common utilities.
 */

import { Effect, Logger, LogLevel } from "effect";

// Configure global Effect settings
export const configureEffect = () => {
  // Set default log level based on environment
  const logLevel =
    process.env.NODE_ENV === "production" ? LogLevel.Info : LogLevel.Debug;

  // Configure global logger
  const logger = Logger.make(({ logLevel, message }) => {
    const timestamp = new Date().toISOString();
    const level = LogLevel.allLevels; //render(logLevel);

    // Format: [TIMESTAMP] [LEVEL] Message
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    switch (logLevel) {
      case LogLevel.Fatal:
      case LogLevel.Error:
        console.error(formattedMessage);
        break;
      case LogLevel.Warning:
        console.warn(formattedMessage);
        break;
      case LogLevel.Info:
        console.info(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  });

  // Set as default logger
  Effect.logWithLevel(logLevel);
  Effect.logDebug(logger);
};

// Export common Effect modules for easy access
export * from "effect";
