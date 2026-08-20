import { getSnipcartProductCatalog } from "../data/productCatalog";

export function GET() {
  return Response.json(getSnipcartProductCatalog(), {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
