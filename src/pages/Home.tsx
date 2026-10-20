import { Hero } from '@/components/home/Hero';
import { Approach } from '@/components/home/Approach';
import { ProductShowcase } from '@/components/product/ProductShowcase';
import { SmartAi } from '@/components/home/SmartAi';
import { GetStarted } from '@/components/home/GetStarted';
import { ClosingCta } from '@/components/home/ClosingCta';
import { usePageMeta } from '@/hooks/usePageMeta';
import { brand } from '@/config/site';

export default function Home() {
  usePageMeta(
    'English Communication & Mentorship',
    brand.description,
  );

  return (
    <>
      <Hero />
      <Approach />
      <ProductShowcase />
      <SmartAi />
      <GetStarted />
      <ClosingCta />
    </>
  );
}
