import { Logger } from "@apollo/utils.logger";
import { TelemetryClient } from "applicationinsights";

export default function (
  input: string | TelemetryClient,
  logName?: string
): Logger {
  let client: TelemetryClient;
  if (typeof input === "string") {
    client = new TelemetryClient(input);
  } else {
    client = input;
  }

  return {
    debug(message) {
      client.trackTrace({
        message,
        properties: {
          logName,
        },
      });
    },
    error(message) {
      client.trackException({
        exception: new Error(message),
        properties: {
          logName,
        },
      });
      client.trackTrace({
        message,
        properties: {
          logName,
        },
      });
    },
    info(message) {
      client.trackTrace({
        message,
        properties: {
          logName,
        },
      });
    },
    warn(message) {
      client.trackTrace({
        message,
        properties: {
          logName,
        },
      });
    },
  };
}
