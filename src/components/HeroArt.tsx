/** Арт первого экрана: Экси у карты клуба. Файл public/hero-club.jpg (1100 px), по краям растворяется маской из theme.css. */
export default function HeroArt() {
  return (
    <figure className="hm-hero-art">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-club.jpg" alt="Экси, маскот клуба EGC, у голографической карты клуба" width={1100} height={733} fetchPriority="high" />
    </figure>
  );
}
