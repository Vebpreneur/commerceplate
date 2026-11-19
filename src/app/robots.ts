import type {MetadataRoute} from "next";
import config from "@/config/config.json";
export default function robots():MetadataRoute.Robots{
 return {rules:{userAgent:"*",allow:"/",disallow:["/api/","/login","/sign-up","/products?"]},sitemap:new URL("/sitemap.xml",config.site.base_url).toString()};
}
