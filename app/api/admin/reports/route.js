import {
  GET as getReports,
  PATCH,
} from "@/app/api/report/route";

export async function GET(request) {
  const url = new URL(request.url);
  url.searchParams.set("scope", "admin");
  return getReports(new Request(url, { method: "GET", headers: request.headers }));
}

export { PATCH };