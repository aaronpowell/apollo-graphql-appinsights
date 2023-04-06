# Azure AppInsights plugin for Apollo Server

NOTE: This version of the package is for Apollo Server v4 - use an older version for Apollo Server v3.

This package provides integration with [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview?WT.mc_id=javascript-7129-aapowell) (part of Azure Monitor) for metrics gathering within Apollo Server.

## Usage

Install the package to your project

```bash
npm install -d @aaronpowell/apollo-server-plugin-appinsights
```

[Create a resource in Azure](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource?WT.mc_id=javascript-7129-aapowell), if required, and copy the **Instrumentation Key**.

Configure the plugin on your Apollo instance:

```js
import appInsightsPlugin from "@aaronpowell/apollo-server-plugin-appinsights";
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [appInsightsPlugin(process.env.APP_INSIGHTS || "")],
});
```

**Note**: if you want to use your own `TelemetryClient` for AppInsights, you can pass that into the `appInsightsPlugin`, rather than the instrumentation key.
