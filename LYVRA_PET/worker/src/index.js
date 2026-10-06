export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({
        status: "ok",
        surface: "lyvra-pet-browser",
        binding: "none",
        free_only: true
      }, { headers: { "cache-control": "no-store" } });
    }

    if (url.pathname === "/api/state") {
      return Response.json({
        pet: "L.Y.V.R.A.",
        authority: "LYVRA_PET/",
        browser_surface: true,
        main_plugin_binding: false,
        deployment_status: "runtime-response-only"
      }, { headers: { "cache-control": "no-store" } });
    }

    return env.ASSETS.fetch(request);
  }
};
