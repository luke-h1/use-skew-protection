const pkg = require("../../../../package.json");

export async function GET() {
  return new Response(pkg.version, {
    status: 200,
  });
}
