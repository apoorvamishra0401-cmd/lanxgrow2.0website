import { LearningEcosystem } from '@/components/ecosystem/LearningEcosystem';
import { Hero } from '@/components/home/Hero';
import { WhyLanXgrow } from '@/components/home/WhyLanXgrow';
import { Journey } from '@/components/home/Journey';
import { ClosingCta } from '@/components/home/ClosingCta';
import { usePageMeta } from '@/hooks/usePageMeta';
import { brand } from '@/config/site';

export default function Home() {
  usePageMeta(
    'English Communication & AI Practice',
    brand.description,
  );

  return (
    <>
      <Hero />
      <LearningEcosystem />
      <WhyLanXgrow />
      <Journey />
      <ClosingCta />
    </>
  );
}
