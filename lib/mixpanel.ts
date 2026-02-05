import mixpanel from "mixpanel-browser";

if (typeof window !== "undefined") {
  mixpanel.init("5823b82036a3087b7c6781180e2b2190", {
    autocapture: false,
    record_sessions_percent: 0,
    api_host: "/mp",
  });
}

export { mixpanel };
