import { Lock } from "@/public/icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const items = [
  { title: "Terms and Condition", url: "https://bitsport.gg/terms-condition/" },
  { title: "Privacy Policy", url: "https://bitsport.gg/privacy-policy/" },
  { title: "Disclaimer", url: "https://bitsport.gg/disclaimer/" },
  { title: "FAQ", url: "https://bitsport.gg/faq/" },
];

const socials = [
  {
    title: "Telegram",
    img: "https://i.imgur.com/kmXfdnU.png",
    url: "https://t.me/bitsport_finance",
  },
  {
    title: "Discord",
    img: "https://i.imgur.com/DD4rYRe.png",
    url: "https://discord.gg/g85V9YkPGd",
  },
  {
    title: "Twitter",
    img: "https://i.imgur.com/ELQWoid.png",
    url: "https://twitter.com/bitsportgaming",
  },
];

const Footer = () => {
  const router = useRouter();
  const isNftRoute = router.route.includes("/nft");
  return (
    <>
      <footer
        key={0}
        className="mt-56 py-6 container items-center flex flex-col gap-4 mx-auto lg:flex lg:flex-row lg:justify-between lg:items-center border-t border-primary-600"
      >
        <div className="font-Poppins text-primary-650 text-xl">
          BitPool @ 2023 By BitSport
        </div>
        <div className="flex items-center gap-8">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="font-Poppins text-primary-650 text-lg"
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Image
                src={social.img}
                width={32}
                height={32}
                alt={social.title}
              />
              <span className="font-Poppins text-primary-650 text-lg">
                {social.title}
              </span>
            </a>
          ))}
        </div>
      </footer>

      <footer key={1} className={`lg:hidden flex justify-center mt-20`}>
        <Lock />
      </footer>
    </>
  );
};

export default Footer;
