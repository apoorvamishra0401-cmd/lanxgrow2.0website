import { Hero } from '@/components/home/Hero';
import { WhyLanXgrow } from '@/components/home/WhyLanXgrow';
import { ProductShowcase } from '@/components/product/ProductShowcase';
import { SmartAi } from '@/components/home/SmartAi';
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
      <WhyLanXgrow />
      <ProductShowcase />
      <Journey />
      <SmartAi />
      
      <ClosingCta />
    </>
  );
}
