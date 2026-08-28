/**
 * Centralized image imports for the portfolio.
 * WebP is the primary format; originals stay as <picture> fallbacks.
 */
import profileImageWebp from '../assets/PP.webp'
import profileImageFallback from '../assets/PP.jpg'
import gcashQRWebp from '../assets/QRgcash.webp'
import gcashQRFallback from '../assets/QRgcash.jpg'
import TopPerformerWebp from '../assets/certificates/TopPerformer.webp'
import TopPerformerFallback from '../assets/certificates/TopPerformer.jpg'
import TopConversionWebp from '../assets/certificates/TopConversion.webp'
import TopConversionFallback from '../assets/certificates/TopConversion.jpg'
import JavaProgrammingWebp from '../assets/certificates/JavaProgramming.webp'
import JavaProgrammingFallback from '../assets/certificates/JavaProgramming.png'
import HackathonChampionWebp from '../assets/certificates/HackathonChampion.webp'
import HackathonChampionFallback from '../assets/certificates/HackathonChampion.jpg'
import BestOralPresentationWebp from '../assets/certificates/BestOralPresentation.webp'
import BestOralPresentationFallback from '../assets/certificates/BestOralPresentation.jpg'
import BestResearchPaperWebp from '../assets/certificates/BestResearchPaper.webp'
import BestResearchPaperFallback from '../assets/certificates/BestResearchPaper.jpg'
import PautakanFirstPlaceWebp from '../assets/certificates/PautakanFirstPlace.webp'
import PautakanFirstPlaceFallback from '../assets/certificates/PautakanFirstPlace.jpg'
import WordPressFundamentalsWebp from '../assets/certificates/WordPressFundamentals.webp'
import WordPressFundamentalsFallback from '../assets/certificates/WordPressFundamentals.jpg'
import AIforCommunitiesWorkshopWebp from '../assets/certificates/AIworkshop.webp'
import AIforCommunitiesWorkshopFallback from '../assets/certificates/AIworkshop.png'
import GalleryPic1Webp from '../assets/gallery/Gallery1.webp'
import GalleryPic1Fallback from '../assets/gallery/Gallery1.jpg'
import GalleryPic2Webp from '../assets/gallery/Gallery2.webp'
import GalleryPic2Fallback from '../assets/gallery/Gallery2.jpg'
import LaunchSmarterLogoWebp from '../assets/companies/launchsmarter.webp'
import LaunchSmarterLogoFallback from '../assets/companies/launchsmarter.png'
import AccentureLogoWebp from '../assets/companies/accenture.webp'
import AccentureLogoFallback from '../assets/companies/accenture.png'
import USPFLogoWebp from '../assets/companies/uspf.webp'
import USPFLogoFallback from '../assets/companies/uspf.png'
import UPCebuLogoWebp from '../assets/companies/up-cebu.webp'
import UPCebuLogoFallback from '../assets/companies/up-cebu.png'
import ProweaverLogoWebp from '../assets/companies/proweaver.webp'
import ProweaverLogoFallback from '../assets/companies/proweaver.jpg'
import FreelanceLogoWebp from '../assets/companies/freelance.webp'
import FreelanceLogoFallback from '../assets/companies/freelance.png'
import BudgjetShotWebp from '../assets/projects/budgjet.webp'
import BudgjetShotFallback from '../assets/projects/budgjet.jpg'
import SmartPOSShotWebp from '../assets/projects/smart-pos.webp'
import SmartPOSShotFallback from '../assets/projects/smart-pos.jpg'
import KBAppShotWebp from '../assets/projects/kb-app.webp'
import KBAppShotFallback from '../assets/projects/kb-app.jpg'
import RoseatteShotWebp from '../assets/projects/roseatte.webp'
import RoseatteShotFallback from '../assets/projects/roseatte.jpg'
import FormConversionToolShotWebp from '../assets/projects/form-conversion-tool.webp'
import FormConversionToolShotFallback from '../assets/projects/form-conversion-tool.jpg'
import LizbethGalarzaShotWebp from '../assets/projects/lizbeth-galarza.webp'
import LizbethGalarzaShotFallback from '../assets/projects/lizbeth-galarza.jpg'
import Conversion1ShotWebp from '../assets/projects/form-conversion1.webp'
import Conversion1ShotFallback from '../assets/projects/form-conversion1.png'
import Budgjet1ShotWebp from '../assets/projects/Budjet1.webp'
import Budgjet1ShotFallback from '../assets/projects/Budjet1.png'
import Budgjet3ShotWebp from '../assets/projects/Budjet3.webp'
import Budgjet3ShotFallback from '../assets/projects/Budjet3.png'
import KnwRepo1ShotWebp from '../assets/projects/KnwRepo1.webp'
import KnwRepo1ShotFallback from '../assets/projects/KnwRepo1.png'
import KnwRepo2ShotWebp from '../assets/projects/KnwRepo2.webp'
import KnwRepo2ShotFallback from '../assets/projects/KnwRepo2.png'
import KnwRepo3ShotWebp from '../assets/projects/KnwRepo3.webp'
import KnwRepo3ShotFallback from '../assets/projects/KnwRepo3.png'
import KnwRepo4ShotWebp from '../assets/projects/KnwRepo4.webp'
import KnwRepo4ShotFallback from '../assets/projects/KnwRepo4.png'
import KnwRepo5ShotWebp from '../assets/projects/KnwRepo5.webp'
import KnwRepo5ShotFallback from '../assets/projects/KnwRepo5.png'
import Pos1ShotWebp from '../assets/projects/Pos1.webp'
import Pos1ShotFallback from '../assets/projects/Pos1.png'
import Pos2ShotWebp from '../assets/projects/Pos2.webp'
import Pos2ShotFallback from '../assets/projects/Pos2.png'
import Pos3ShotWebp from '../assets/projects/Pos3.webp'
import Pos3ShotFallback from '../assets/projects/Pos3.png'
import Pos4ShotWebp from '../assets/projects/Pos4.webp'
import Pos4ShotFallback from '../assets/projects/Pos4.png'
import Pos5ShotWebp from '../assets/projects/Pos5.webp'
import Pos5ShotFallback from '../assets/projects/Pos5.png'
import PageSpeedBeforeShotWebp from '../assets/projects/pagespeed.webp'
import PageSpeedBeforeShotFallback from '../assets/projects/pagespeed.png'
import PageSpeedAfterShotWebp from '../assets/projects/pagespeedafter.webp'
import PageSpeedAfterShotFallback from '../assets/projects/pagespeedafter.png'

const fallbacks = new Map()

function img(webp, fallback) {
  if (fallback) fallbacks.set(webp, fallback)
  return webp
}

export { fallbacks }

export const profileImage = img(profileImageWebp, profileImageFallback)
export const gcashQR = img(gcashQRWebp, gcashQRFallback)
export const TopPerformer = img(TopPerformerWebp, TopPerformerFallback)
export const TopConversion = img(TopConversionWebp, TopConversionFallback)
export const JavaProgramming = img(JavaProgrammingWebp, JavaProgrammingFallback)
export const HackathonChampion = img(HackathonChampionWebp, HackathonChampionFallback)
export const BestOralPresentation = img(BestOralPresentationWebp, BestOralPresentationFallback)
export const BestResearchPaper = img(BestResearchPaperWebp, BestResearchPaperFallback)
export const PautakanFirstPlace = img(PautakanFirstPlaceWebp, PautakanFirstPlaceFallback)
export const WordPressFundamentals = img(WordPressFundamentalsWebp, WordPressFundamentalsFallback)
export const AIforCommunitiesWorkshop = img(AIforCommunitiesWorkshopWebp, AIforCommunitiesWorkshopFallback)
export const GalleryPic1 = img(GalleryPic1Webp, GalleryPic1Fallback)
export const GalleryPic2 = img(GalleryPic2Webp, GalleryPic2Fallback)
export const LaunchSmarterLogo = img(LaunchSmarterLogoWebp, LaunchSmarterLogoFallback)
export const AccentureLogo = img(AccentureLogoWebp, AccentureLogoFallback)
export const USPFLogo = img(USPFLogoWebp, USPFLogoFallback)
export const UPCebuLogo = img(UPCebuLogoWebp, UPCebuLogoFallback)
export const ProweaverLogo = img(ProweaverLogoWebp, ProweaverLogoFallback)
export const FreelanceLogo = img(FreelanceLogoWebp, FreelanceLogoFallback)
export const BudgjetShot = img(BudgjetShotWebp, BudgjetShotFallback)
export const SmartPOSShot = img(SmartPOSShotWebp, SmartPOSShotFallback)
export const KBAppShot = img(KBAppShotWebp, KBAppShotFallback)
export const RoseatteShot = img(RoseatteShotWebp, RoseatteShotFallback)
export const FormConversionToolShot = img(FormConversionToolShotWebp, FormConversionToolShotFallback)
export const LizbethGalarzaShot = img(LizbethGalarzaShotWebp, LizbethGalarzaShotFallback)
export const Conversion1Shot = img(Conversion1ShotWebp, Conversion1ShotFallback)
export const Budgjet1Shot = img(Budgjet1ShotWebp, Budgjet1ShotFallback)
export const Budgjet3Shot = img(Budgjet3ShotWebp, Budgjet3ShotFallback)
export const KnwRepo1Shot = img(KnwRepo1ShotWebp, KnwRepo1ShotFallback)
export const KnwRepo2Shot = img(KnwRepo2ShotWebp, KnwRepo2ShotFallback)
export const KnwRepo3Shot = img(KnwRepo3ShotWebp, KnwRepo3ShotFallback)
export const KnwRepo4Shot = img(KnwRepo4ShotWebp, KnwRepo4ShotFallback)
export const KnwRepo5Shot = img(KnwRepo5ShotWebp, KnwRepo5ShotFallback)
export const Pos1Shot = img(Pos1ShotWebp, Pos1ShotFallback)
export const Pos2Shot = img(Pos2ShotWebp, Pos2ShotFallback)
export const Pos3Shot = img(Pos3ShotWebp, Pos3ShotFallback)
export const Pos4Shot = img(Pos4ShotWebp, Pos4ShotFallback)
export const Pos5Shot = img(Pos5ShotWebp, Pos5ShotFallback)
export const PageSpeedBeforeShot = img(PageSpeedBeforeShotWebp, PageSpeedBeforeShotFallback)
export const PageSpeedAfterShot = img(PageSpeedAfterShotWebp, PageSpeedAfterShotFallback)
