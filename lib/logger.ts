// lib/logger.ts — Structured JSON logger for server-side code
// Outputs JSON in production (machine-readable), pretty in development.
// Pairs with any log aggregator (Datadog, Logtail, AWS CloudWatch, etc.)

type LogLevel = "debug" | "info" | "warn" | "error";
type LogContext = Record<string, unknown>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service: string;
  environment: string;
  context?: LogContext;
  error?: {
    message: string;
    name: string;
    stack?: string;
  };
}

function log(level: LogLevel, message: string, context?: LogContext, error?: unknown) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: "Jabiyehome",
    environment: process.env.NODE_ENV ?? "development",
    ...(context ? { context } : {}),
  };

  if (error && error instanceof Error) {
    entry.error = {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    };
  }

  if (process.env.NODE_ENV === "production") {
    // JSON for log aggregators
    const output = JSON.stringify(entry);
    if (level === "error" || level === "warn") {
      console.error(output);
    } else {
      console.log(output);
    }
  } else {
    // Human-readable in development
    const prefix = { debug: "🔍", info: "ℹ️", warn: "⚠️", error: "❌" }[level];
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    const errorStr = error instanceof Error ? `\n  Error: ${error.message}` : "";
    console[level === "debug" ? "log" : level](`${prefix} [${entry.timestamp}] ${message}${contextStr}${errorStr}`);
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log("debug", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext, error?: unknown) => log("warn", message, context, error),
  error: (message: string, context?: LogContext, error?: unknown) => log("error", message, context, error),
};

export default logger;
