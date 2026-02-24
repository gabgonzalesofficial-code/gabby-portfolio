export default function DonationModalContent({ profileInfo }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300 text-center">{profileInfo.donation.message}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GCash – left column */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GCash</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Mobile Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-gray-900 dark:text-white">{profileInfo.donation.gcash.number}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profileInfo.donation.gcash.number)
                    alert('GCash number copied to clipboard!')
                  }}
                  className="text-blue-600 hover:text-blue-700 cursor-pointer"
                  title="Copy number"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Account Name:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{profileInfo.donation.gcash.name}</span>
            </div>
            <a
              href={`gcash://pay?number=${profileInfo.donation.gcash.number.replace(/\s/g, '')}`}
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition cursor-pointer font-medium"
            >
              Open GCash App
            </a>
          </div>
        </div>

        {/* PayPal – right column */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.13 6.537-6.983 6.537h-2.87c-.748 0-1.127.363-1.305.838l-1.17 3.279a1.098 1.098 0 0 1-.104.24.327.327 0 0 1-.112.12c-.04.025-.092.041-.148.041H9.43a.582.582 0 0 1-.536-.352L7.077 21.337zm1.461-13.966c-.073.01-.145.026-.213.05-.07.023-.14.05-.2.08-.06.03-.11.064-.15.1-.04.038-.07.08-.09.13-.02.05-.03.1-.03.15v.12l.57 3.074.04.2c.01.05.03.09.06.13.03.04.07.07.11.09.05.02.1.03.15.03h2.85c.08 0 .15-.01.2-.04.05-.02.1-.05.13-.1l.06-.1.38-2.28.04-.2c0-.05-.01-.1-.03-.15-.02-.05-.05-.09-.09-.13-.04-.04-.09-.07-.15-.1a1.26 1.26 0 0 0-.2-.08 1.2 1.2 0 0 0-.21-.05h-2.73z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PayPal</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{profileInfo.donation.paypal.email}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick amounts:</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {profileInfo.donation.paypal.defaultAmounts.map((amount) => (
                <a
                  key={amount}
                  href={`${profileInfo.donation.paypal.link}/${amount}${profileInfo.donation.paypal.currency}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer font-medium text-center text-sm"
                >
                  ₱{amount.toLocaleString()}
                </a>
              ))}
            </div>
            <a
              href={profileInfo.donation.paypal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition cursor-pointer font-medium"
            >
              Donate via PayPal (Custom Amount)
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Accepts credit/debit cards and PayPal balance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
