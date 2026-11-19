"use client";

import Logo from "@/components/Logo";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import social from "@/config/social.json";
import DynamicIcon from "@/helpers/DynamicIcon";
import { markdownify } from "@/lib/utils/textConverter";
import Link from "next/link";

export interface ISocial {
  name: string;
  icon: string;
  link: string;
}

const Footer = () => {
  const { copyright } = config.params;

  return (
    <footer className="bg-black text-white [&_.navbar-brand]:!text-white [&_.footer-link]:!text-neutral-300 [&_.footer-link:hover]:!text-white">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 lg:py-20 items-start">
          <div><Logo /><p className="mt-5 text-neutral-300 max-w-xs text-sm leading-relaxed">Smart teknik. Genomtänkt design. Ett enklare liv tillsammans.</p></div>

          <div><h3 className="!text-white text-base mb-5">Pawlira</h3><ul className="space-y-3">
            {menu.footer.map((menu) => (
              <li className="footer-link" key={menu.name}>
                <Link href={menu.url}>{menu.name}</Link>
              </li>
            ))}
          </ul>

          </div><div><h3 className="!text-white text-base mb-5">Kundinformation</h3><ul className="space-y-3">{menu.footerCopyright.map(item=><li key={item.url} className="footer-link"><Link href={item.url}>{item.name}</Link></li>)}</ul></div>
          <div><h3 className="!text-white text-base mb-5">Upptäck</h3><Link href="/products" className="text-neutral-300 text-sm underline">Utforska sortimentet</Link>
          {/* social share */}
          <ul className="social-icons social-icons-footer">
            {social?.main.map((social: ISocial) => (
              <li key={social.name}>
                <a
                  aria-label={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <span className="sr-only">{social.name}</span>
                  <DynamicIcon className="inline-block" icon={social.icon} />
                </a>
              </li>
            ))}
          </ul></div>
        </div>

        <div className="border-t border-neutral-800 py-5">
          <div className="flex flex-col md:flex-row gap-y-2 justify-between items-center text-neutral-300">
            <ul className="flex gap-x-4">
              {menu.footerCopyright.map((menu) => (
                <li className="footer-link" key={menu.name}>
                  <Link href={menu.url}>{menu.name}</Link>
                </li>
              ))}
            </ul>

            <p
              className="text-sm font-light"
              dangerouslySetInnerHTML={markdownify(copyright)}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
