import Link, { LinkProps } from "next/link";

type Props = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({ ...linkProps }: Props) {
  return (
    <Link
      {...linkProps}
      className="px-5 py-2 rounded-3xl bg-blue my-5 hover:bg-transparent border border-transparent hover:border hover:text-blue hover:border-blue"
    >
      {linkProps.children}
    </Link>
  );
}
