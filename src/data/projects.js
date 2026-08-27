import { projectsText } from './projectsText'
import {
  BudgjetShot, SmartPOSShot, KBAppShot, RoseatteShot,
  FormConversionToolShot, LizbethGalarzaShot,
  Conversion1Shot, KnwRepo1Shot, KnwRepo2Shot, KnwRepo3Shot, KnwRepo4Shot, KnwRepo5Shot,
  Pos1Shot, Pos2Shot, Pos3Shot, Pos4Shot, Pos5Shot,
  PageSpeedBeforeShot, PageSpeedAfterShot,
  Budgjet1Shot, Budgjet3Shot
} from './profileImages'

const imageMap = {
  SmartPOSShot, BudgjetShot, KBAppShot, RoseatteShot, FormConversionToolShot, LizbethGalarzaShot,
  Conversion1Shot, KnwRepo1Shot, KnwRepo2Shot, KnwRepo3Shot, KnwRepo4Shot, KnwRepo5Shot,
  Pos1Shot, Pos2Shot, Pos3Shot, Pos4Shot, Pos5Shot,
  PageSpeedBeforeShot, PageSpeedAfterShot,
  Budgjet1Shot, Budgjet3Shot
}

// Merge text data from projectsText with images
export const projects = projectsText.map(p => {
  const enriched = { ...p }

  // Add images based on project name
  switch (p.name) {
    case 'Smart POS':
      enriched.image = imageMap.SmartPOSShot
      enriched.screenshots = [imageMap.Pos1Shot, imageMap.Pos2Shot, imageMap.Pos3Shot, imageMap.Pos4Shot, imageMap.Pos5Shot]
      break
    case 'Form Conversion Tool':
      enriched.image = imageMap.FormConversionToolShot
      enriched.screenshots = [imageMap.Conversion1Shot, imageMap.FormConversionToolShot]
      break
    case 'Budgjet':
      enriched.image = imageMap.BudgjetShot
      enriched.screenshots = [imageMap.Budgjet1Shot, imageMap.Budgjet3Shot]
      break
    case 'Knowledge Base App':
      enriched.image = imageMap.KBAppShot
      enriched.screenshots = [imageMap.KnwRepo1Shot, imageMap.KnwRepo2Shot, imageMap.KnwRepo3Shot, imageMap.KnwRepo4Shot, imageMap.KnwRepo5Shot]
      break
    case 'Homes with Liz':
      enriched.image = imageMap.LizbethGalarzaShot
      break
    case 'Roseatte':
      enriched.image = imageMap.RoseatteShot
      enriched.screenshots = [imageMap.RoseatteShot, imageMap.PageSpeedBeforeShot, imageMap.PageSpeedAfterShot]
      break
    default:
      break
  }

  return enriched
})
