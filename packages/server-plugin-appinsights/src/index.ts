import {
  ApolloServerPlugin,
  GraphQLSchemaContext,
  GraphQLServerListener,
} from "@apollo/server";
import { TelemetryClient } from "applicationinsights";
import { v4 as uuid } from "uuid";

export default function (
  input: string | TelemetryClient,
  logName?: string
): ApolloServerPlugin {
  let client: TelemetryClient;
  if (typeof input === "string") {
    client = new TelemetryClient(input);
  } else {
    client = input;
  }

  return {
    async serverWillStart(service): Promise<GraphQLServerListener> {
      const requestId = uuid();
      client.trackEvent({
        name: "serviceWillStart",
        time: new Date(),
        properties: {
          apolloConfig: service.apollo,
          schema: service.schema,
          requestId,
          logName,
          startedInBackground: service.startedInBackground,
        },
      });

      return Promise.resolve({
        async drainServer() {
          client.trackEvent({
            name: "drainServer",
            time: new Date(),
            properties: { requestId, logName },
          });
        },
        schemaDidLoadOrUpdate(schemaContext: GraphQLSchemaContext) {
          client.trackEvent({
            name: "schemaDidLoadOrUpdate",
            properties: {
              schema: schemaContext.apiSchema.toString(),
              requestId,
              logName,
            },
            time: new Date(),
          });
        },
        async serverWillStop() {
          client.trackEvent({
            name: "serverWillStop",
            time: new Date(),
            properties: { requestId, logName },
          });
        },
      });
    },
    async requestDidStart(context) {
      const requestId = uuid();
      const headers: { [key: string]: string | null } = {};
      if (context.request.http?.headers) {
        for (const [key, value] of context.request.http.headers) {
          headers[key] = value;
        }
      }
      client.trackEvent({
        name: "requestDidStart",
        time: new Date(),
        properties: {
          requestId,
          metrics: context.metrics,
          request: context.request,
          headers,
          operationName: context.operationName || context.request.operationName,
          operation: context.operation,
          logName,
        },
      });

      return {
        async didEncounterErrors(requestContext) {
          for (const error in requestContext.errors) {
            client.trackException({
              exception: new Error(error),
              properties: {
                requestId,
                logName,
              },
            });
          }
        },
        async didResolveOperation(requestContext) {
          client.trackEvent({
            name: "didResolveOperation",
            properties: {
              requestId,
              operationName: requestContext.operationName,
              operation: requestContext.operation,
              logName,
            },
          });
        },
        async didResolveSource(requestContext) {
          client.trackEvent({
            name: "didResolveSource",
            properties: {
              requestId,
              source: requestContext.source,
              queryHash: requestContext.queryHash,
              metrics: requestContext.metrics,
              logName,
            },
          });
        },
        async parsingDidStart(requestContext) {
          client.trackEvent({
            name: "parsingDidStart",
            properties: {
              requestId,
              source: requestContext.source,
              queryHash: requestContext.queryHash,
              metrics: requestContext.metrics,
              logName,
            },
          });
        },
        async validationDidStart(requestContext) {
          client.trackEvent({
            name: "validationDidStart",
            properties: {
              requestId,
              source: requestContext.source,
              queryHash: requestContext.queryHash,
              metrics: requestContext.metrics,
              logName,
            },
          });
        },
        async executionDidStart(requestContext) {
          const executionId = uuid();
          client.trackEvent({
            name: "executionDidStart",
            properties: {
              requestId,
              executionId,
              source: requestContext.source,
              queryHash: requestContext.queryHash,
              metrics: requestContext.metrics,
              doc: requestContext.document,
              logName,
            },
          });

          return {
            async executionDidEnd(error) {
              client.trackEvent({
                name: "executionDidEnd",
                properties: {
                  requestId,
                  executionId,
                  error,
                  logName,
                },
              });
            },
            willResolveField(fieldResolverParams) {
              client.trackEvent({
                name: "willResolveField",
                properties: {
                  requestId,
                  executionId,
                  source: fieldResolverParams.source,
                  args: fieldResolverParams.args,
                  logName,
                },
              });

              return async (error, result) => {
                client.trackEvent({
                  name: "willResolveFieldCallback",
                  properties: {
                    requestId,
                    executionId,
                    error,
                    result,
                    logName,
                  },
                });
              };
            },
          };
        },
        async responseForOperation(requestContext) {
          client.trackEvent({
            name: "responseForOperation",
            properties: {
              requestId,
              source: requestContext.source,
              queryHash: requestContext.queryHash,
              metrics: requestContext.metrics,
              logName,
            },
          });
          return null;
        },
        async willSendResponse({ response, metrics }) {
          client.trackEvent({
            name: "willSendResponse",
            properties: {
              requestId,
              response,
              metrics,
              logName,
            },
          });
        },
      };
    },
  };
}
