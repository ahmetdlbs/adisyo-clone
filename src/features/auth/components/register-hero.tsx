import Image from "next/image";

/** Left panel of the register screen: the marketing photo, hidden below the lg breakpoint. */
export function RegisterHero() {
  return (
    <div className="relative hidden w-1/2 shrink-0 bg-muted lg:block">
      <Image src="/images/register-hero.jpg" alt="Adisyo çevrimiçi siparişler" fill priority sizes="50vw" className="object-cover" />
    </div>
  );
}
