import './IsometricRoom.css'

function IsometricRoom() {
  return (
    <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Workspace</h2>
      </div>

      {/* Isometric room */}
      <div className="iso-room-wrapper">
        <div className="iso-room">
          {/* Rug */}
          <div className="iso-rug" />

          {/* Floor */}
          <div className="iso-floor" />

          {/* Walls */}
          <div className="iso-wall-back" />
          <div className="iso-wall-left" />

          {/* Bookshelf (on left wall) */}
          <div className="iso-bookshelf">
            <div className="iso-shelf-plank iso-shelf-plank-1" />
            <div className="iso-shelf-plank iso-shelf-plank-2" />
            <div className="iso-books-row iso-books-row-1">
              <div className="iso-book iso-book-1" />
              <div className="iso-book iso-book-2" />
              <div className="iso-book iso-book-3" />
              <div className="iso-book iso-book-4" />
              <div className="iso-book iso-book-5" />
            </div>
            <div className="iso-books-row iso-books-row-2">
              <div className="iso-book iso-book-6" />
              <div className="iso-book iso-book-7" />
              <div className="iso-book iso-book-8" />
            </div>
          </div>

          {/* Plant */}
          <div className="iso-plant">
            <div className="iso-leaf iso-leaf-1" />
            <div className="iso-leaf iso-leaf-2" />
            <div className="iso-leaf iso-leaf-3" />
            <div className="iso-leaf iso-leaf-4" />
            <div className="iso-pot" />
          </div>

          {/* Sleeping cat */}
          <div className="iso-cat">
            <div className="iso-cat-body" />
            <div className="iso-cat-tail" />
            <div className="iso-cat-zzz">z z z</div>
          </div>

          {/* Chair */}
          <div className="iso-chair">
            <div className="iso-chair-backrest" />
            <div className="iso-chair-seat" />
            <div className="iso-chair-base" />
            <div className="iso-chair-wheels" />
          </div>

          {/* LED strip under desk edge */}
          <div className="iso-led-strip" />

          {/* Desk */}
          <div className="iso-desk">
            <div className="iso-desk-top" />
            <div className="iso-desk-front" />
            <div className="iso-desk-side" />

            {/* Monitors */}
            <div className="iso-monitors">
              {/* Left monitor */}
              <div className="iso-monitor iso-monitor-left">
                <div className="iso-monitor-body">
                  <div className="iso-monitor-screen">
                    <div className="iso-code-lines">
                      <div className="iso-code-line iso-code-line-1" />
                      <div className="iso-code-line iso-code-line-2" />
                      <div className="iso-code-line iso-code-line-3" />
                      <div className="iso-code-line iso-code-line-4" />
                      <div className="iso-code-line iso-code-line-5" />
                      <div className="iso-code-line iso-code-line-6" />
                      <div className="iso-code-line iso-code-line-7" />
                      <div className="iso-code-line iso-code-line-8" />
                    </div>
                    <div className="iso-cursor" />
                  </div>
                </div>
                <div className="iso-monitor-stand" />
                <div className="iso-monitor-base" />
              </div>

              {/* Right monitor */}
              <div className="iso-monitor iso-monitor-right">
                <div className="iso-monitor-body">
                  <div className="iso-monitor-screen">
                    <div className="iso-code-lines">
                      <div className="iso-code-line iso-code-line-7" />
                      <div className="iso-code-line iso-code-line-3" />
                      <div className="iso-code-line iso-code-line-1" />
                      <div className="iso-code-line iso-code-line-5" />
                      <div className="iso-code-line iso-code-line-8" />
                      <div className="iso-code-line iso-code-line-2" />
                      <div className="iso-code-line iso-code-line-4" />
                      <div className="iso-code-line iso-code-line-6" />
                    </div>
                  </div>
                </div>
                <div className="iso-monitor-stand" />
                <div className="iso-monitor-base" />
              </div>
            </div>
          </div>

          {/* Keyboard */}
          <div className="iso-keyboard" />

          {/* Mouse */}
          <div className="iso-mouse" />

          {/* Coffee cup */}
          <div className="iso-coffee">
            <div className="iso-cup" />
            <div className="iso-steam">
              <div className="iso-steam-1" />
              <div className="iso-steam-2" />
              <div className="iso-steam-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IsometricRoom
