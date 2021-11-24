# Azure AppInsights for Apollo Server Logging

This package provides integration with [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview?WT.mc_id=javascript-7129-aapowell) (part of Azure Monitor) for logging within Apollo Server.

## Usage

Install the package to your project

```bash
npm install -d @aaronpowell/apollo-server-logger-appinsights
```

[Create a resource in Azure](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource?WT.mc_id=javascript-7129-aapowell), if required, and copy the **Instrumentation Key**.

Configure the logger on your Apollo instance:

```js
import appInsightsLogger from "@aaronpowell/apollo-server-logger-appinsights";
const server = new ApolloServer({
  typeDefs,
  resolvers,
  logger: appInsightsLogger(process.env.APP_INSIGHTS || ""),
});
```

**Note**: if you want to use your own `TelemetryClient` for AppInsights, you can pass that into the `appInsightsLogger`, rather than the instrumentation key.
