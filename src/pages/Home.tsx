import { AudienceEntry } from '@/components/home/AudienceEntry';
import { AvailableNow } from '@/components/home/AvailableNow';
import { MeetLanX } from '@/components/home/MeetLanX';
import { LearningEcosystem } from '@/components/ecosystem/LearningEcosystem';
import { VersionBHero } from '@/components/home/VersionBHero';
import { PersonalizedReport } from '@/components/home/PersonalizedReport';
import { VersionBLearningMethod } from '@/components/home/VersionBLearningMethod';
import { WhyLanXgrow } from '@/components/home/WhyLanXgrow';
import { ResearchStories } from '@/components/home/ResearchStories';
import { RealConversations } from '@/components/home/RealConversations';
import { VersionBJourney } from '@/components/home/VersionBJourney';
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
      <AudienceEntry />
      <PersonalizedReport />
      <MeetLanX />
      <AvailableNow />
      <LearningEcosystem />
      <WhyLanXgrow />
      <VersionBLearningMethod />
      <ResearchStories />
      <RealConversations />
      <VersionBJourney />
    </>
  );
}
