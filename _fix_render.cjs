const fs = require require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// Instead of overlay, conditionally render: if currentProject, show ONLY ProjectPage
// Otherwise show the portfolio

const appStart = `    return (
    <div className="min-h-screen bg-black portfolio-enter" style={{ overflowX: 'clip' }}>`;

const appEnd = `    </div>
  )`;

// Find where the main div starts and ends
const startIdx = c.indexOf(appStart);
const endIdx = c.lastIndexOf(appEnd);

if (startIdx === -1 || endIdx === -1) {
  console.log('Could not find render boundaries');
  process.exit(1);
}

// Get everything between the opening and closing div tags
const innerContent = c.substring(startIdx + appStart.length, endIdx);

// Build new render: if currentProject, show ProjectPage; else show portfolio
const newRender = `    return (
    <div className="min-h-screen bg-black" style={currentProject ? {} : { overflowX: 'clip' }}>
      {currentProject ? (
        <ProjectPage project={currentProject} onBack={goBack} />
      ) : (
        <>
          <AnimatedBackground />
          <Navbar profileInfo={profileInfo} />
          <Hero profileInfo={profileInfo} onOpenDonation={() => openModal('Support My Work', <DonationModalContent profileInfo={profileInfo} />)} />
          <TechStack techStack={techStack} services={services} onOpenAll={() => openModal('Tech Stack', <TechStackModalContent techStack={techStack} />, { size: 'xl' })} />
          <Projects projects={projects} onOpenProject={goToProject} />
          <ExperienceAwards experience={experience} certifications={certifications} onOpenAllCertifications={() => openModal('All Certifications', <AllProjectsModalContent certifications={certifications} />, { size: 'xl', bodyScroll: false })} />
          <GalleryReviews galleryImages={galleryImages} recommendations={recommendations} onOpenFull={(rec) => openModal('Recommendation', <div className="space-y-4"><blockquote className="text-cream/80 italic border-l-4 border-tan/30 pl-4 text-lg">&ldquo;{rec.quote}&rdquo;</blockquote><p className="text-tan/70">— <span className="font-semibold text-cream/90">{rec.author}</span>, {rec.position}</p></div>)} />
          <Contact />
          <Footer footer={footer} />
          <Suspense fallback={<div className="fixed bottom-4 right-4 w-[110px] h-[110px] rounded-full bg-tan/10 animate-pulse" style={{ zIndex: 9999 }} aria-hidden />}>
            <EveRobot onClick={() => setIsChatOpen((prev) => !prev)} aria-label={isChatOpen ? "Close chat" : "Open chat with Gabriel"} chatOpen={isChatOpen} />
          </Suspense>
          {isChatOpen && (<Suspense fallback={<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center" onClick={() => setIsChatOpen(false)} role="button" tabIndex={0} aria-label="Loading chat" />}><ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} /></Suspense>)}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title} size={modalContent.size} bodyScroll={modalContent.bodyScroll}>{modalContent.content}</Modal>
        </>
      )}
    </div>
  )`;

const newContent = c.substring(0, startIdx) + newRender + c.substring(endIdx + appEnd.length);
fs.writeFileSync('src/App.jsx', newContent);
console.log('Replaced render logic');
