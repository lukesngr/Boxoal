// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1df9254fc455ec07da7a7527c4b58147@o4509511383842816.ingest.us.sentry.io/4509511398785024",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
