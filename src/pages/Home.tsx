import { AvailableNow } from '@/components/home/AvailableNow';
import { MeetLanX } from '@/components/home/MeetLanX';
import { LearningEcosystem } from '@/components/ecosystem/LearningEcosystem';
import { VersionBHero } from '@/components/home/VersionBHero';
import { PersonalizedReport } from '@/components/home/PersonalizedReport';
import { WhyLanXgrow } from '@/components/home/WhyLanXgrow';
import { ResearchStories } from '@/components/home/ResearchStories';
import { RealConversations } from '@/components/home/RealConversations';
import { Journey } from '@/components/home/Journey';
import { ClosingCta } from '@/components/home/ClosingCta';
import { usePageMeta } from '@/hooks/usePageMeta';
import { brand } from '@/config/site';

export default function Home() {
  usePageMeta(
    'AI English Practice & Personalized Reports',
    brand.description,
  );

  return (
    <>
      <VersionBHero />
      <PersonalizedReport />
      <MeetLanX />
      <AvailableNow />
      <LearningEcosystem />
      <WhyLanXgrow />
      <ResearchStories />
      <RealConversations />
      <Journey />
      <ClosingCta />
    </>
  );
}
