// import { x } from "react";
import { getTicker } from "./lib/httpClient";
import { Ticker } from "./lib/types";

export default function Home() {
  // const [tickers, setTickers] = useState<Ticker[]>([]);
  // const [singleTicker, setSingleTicker] = useState<Ticker | null>(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const allTickers = await getTicker();
  //       setTickers(allTickers);

  //       if (allTickers.length > 0) {
  //         const market = allTickers[0].symbol; // Test with first ticker
  //         const tickerData = await getTicker(market);
  //         setSingleTicker(tickerData);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data", error);
  //     }
  //   }

  //   fetchData();
  // }, []);

  const companyLogos = [
    { name: "Wells", logo: "Wells_Fargo-Logo.wine.png" },
    { name: "Barclays", logo: "Barclays-Logo.png" },
    { name: "PayPal", logo: "PayPal.png" },
    { name: "AMEX-Logo", logo: "American_Express-Logo.wine.png" },
  ];
  return (
    <>
      <div className="bg-gray-900 text-white">


        <div className="gradient-bg pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-12 lg:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Trade Smarter with{" "}
                  <span className="text-blue-400">Tradosphere</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-lg">
                  Advanced trading platform with real-time analytics, AI-powered
                  insights, and seamless execution for both beginners and
                  professionals.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <a
                    href="#"
                    className="bg-blue-600 hover:bg-blue-700 text-center px-8 py-3 rounded-lg font-medium text-lg transition"
                  >
                    Get Started Free
                  </a>
                  <a
                    href="#"
                    className="border border-gray-600 hover:border-blue-400 text-center px-8 py-3 rounded-lg font-medium text-lg transition"
                  >
                    View Demo
                  </a>
                </div>
                <div className="mt-8 flex items-center text-gray-400">
                  <div className="flex -space-x-2 mr-4">
                    <img
                      src="/api/placeholder/50/50"
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-gray-800"
                    />
                    <img
                      src="/api/placeholder/50/50"
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-gray-800"
                    />
                    <img
                      src="/api/placeholder/50/50"
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-gray-800"
                    />
                  </div>
                  <span>Trusted by 10,000+ traders worldwide</span>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-4 shadow-2xl">
                  <div className="chart-container">
                    <canvas id="tradingChart"></canvas>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">BTC/USD</span>
                        <span className="text-green-400 text-sm">+2.4%</span>
                      </div>
                      <div className="text-lg font-semibold">$63,245</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">ETH/USD</span>
                        <span className="text-green-400 text-sm">+1.8%</span>
                      </div>
                      <div className="text-lg font-semibold">$3,782</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">XRP/USD</span>
                        <span className="text-red-400 text-sm">-0.7%</span>
                      </div>
                      <div className="text-lg font-semibold">$0.6231</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 z-0"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20 z-0"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 py-12">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-500 mb-8 font-medium">
              TRUSTED BY LEADING COMPANIES
            </p>
            <div className="flex justify-around gap-8 items-center">
              {companyLogos.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center opacity-80 hover:opacity-100 transition duration-300 h-10 "
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-32 w-48 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="features" className="bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trading Made Simple, Yet Powerful
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover the most comprehensive set of tools designed for
                traders of all levels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 hover:bg-opacity-70 transition">
                <div className="w-12 h-12 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Real-Time Analytics
                </h3>
                <p className="text-gray-400">
                  Access up-to-the-second market data and visualization tools to
                  make informed trading decisions.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 hover:bg-opacity-70 transition">
                <div className="w-12 h-12 bg-purple-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  AI-Powered Insights
                </h3>
                <p className="text-gray-400">
                  Let our advanced algorithms analyze market patterns and
                  suggest optimal trading opportunities.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 hover:bg-opacity-70 transition">
                <div className="w-12 h-12 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Enterprise-Grade Security
                </h3>
                <p className="text-gray-400">
                  Rest assured with our military-grade encryption, two-factor
                  authentication, and cold storage solutions.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 hover:bg-opacity-70 transition">
                <div className="w-12 h-12 bg-red-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">24/7 Trading</h3>
                <p className="text-gray-400">
                  Trade anytime, anywhere with our round-the-clock platform
                  availability and global market access.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 hover:bg-opacity-70 transition">
                <div className="w-12 h-12 bg-yellow-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Low Transaction Fees
                </h3>
                <p className="text-gray-400">
                  Enjoy competitive rates with our transparent fee structure and
                  volume-based discounts.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 hover:bg-opacity-70 transition">
                <div className="w-12 h-12 bg-indigo-600 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Multiple Payment Methods
                </h3>
                <p className="text-gray-400">
                  Fund your account easily with credit cards, bank transfers,
                  and various cryptocurrencies.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="markets" className="bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trade Multiple Markets
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Access thousands of markets from a single platform with
                competitive spreads.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-700 transition">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Cryptocurrencies</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Trade Bitcoin, Ethereum, and 50+ altcoins with deep liquidity
                  and tight spreads.
                </p>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">BTC/USD</span>
                  <span className="text-green-400">+2.4%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ETH/USD</span>
                  <span className="text-green-400">+1.8%</span>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-700 transition">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Stocks & ETFs</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Access global stocks and ETFs from US, European, and Asian
                  markets.
                </p>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">AAPL</span>
                  <span className="text-green-400">+0.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">TSLA</span>
                  <span className="text-red-400">-1.2%</span>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-700 transition">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Forex</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Trade major, minor and exotic currency pairs with competitive
                  spreads.
                </p>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">EUR/USD</span>
                  <span className="text-green-400">+0.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">USD/JPY</span>
                  <span className="text-red-400">-0.1%</span>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-700 transition">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Commodities</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Trade gold, silver, oil, natural gas and other commodities
                  24/7.
                </p>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Gold</span>
                  <span className="text-green-400">+0.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Oil</span>
                  <span className="text-red-400">-0.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Trade Anywhere, Anytime
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Our platform works seamlessly across all devices with native
                  apps for iOS, Android, Windows, and macOS.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-400 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">
                        Responsive Trading Interface
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Optimized for all screen sizes with no compromise on
                        features
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-400 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">
                        Real-time Synchronization
                      </h4>
                      <p className="text-gray-400 text-sm">
                        All your settings, watchlists, and alerts sync across
                        devices
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-400 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Push Notifications</h4>
                      <p className="text-gray-400 text-sm">
                        Stay informed with customizable price alerts and trade
                        confirmations
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4 mb-14">
                  <a
                    href="#"
                    className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.5639 12.1428C17.5508 9.45616 19.8711 8.0895 19.9502 8.0435C18.6195 6.08875 16.6123 5.82158 15.8838 5.80908C14.1525 5.63158 12.4838 6.82533 11.6045 6.82533C10.7086 6.82533 9.36067 5.82783 7.87892 5.85533C5.96992 5.88283 4.18567 7.04158 3.20067 8.82033C1.15967 12.4519 2.68992 17.7957 4.65267 20.4478C5.63967 21.7457 6.79542 23.2169 8.28517 23.1628C9.74042 23.1044 10.288 22.2194 12.0435 22.2194C13.7834 22.2194 14.2927 23.1628 15.8172 23.1253C17.3804 23.1044 18.3797 21.8119 19.3361 20.3894C20.4394 21.8019 20.9062 22.4807 22.1089 22.4307C23.375 22.3757 24.2795 21.2982 25.2491 19.8132C26.3538 18.1359 26.8275 16.5097 26.8641 16.3822C26.8262 16.3684 23.0809 14.9238 23.0383 11.6663C23.0038 8.9797 26.0039 7.2947 26.154 7.18595C24.7189 5.12345 22.542 4.79495 21.6646 4.74745C19.9671 4.61245 18.338 5.71495 17.5639 5.71495C16.8045 5.71495 15.442 4.77345 13.9987 4.77345C10.6339 4.77345 7.2 7.5222 7.2 12.7972C7.2 15.8097 8.52317 18.9922 10.1739 21.0097C11.4889 22.6522 12.6584 23.9997 14.3114 23.9997C15.9284 23.9997 16.5834 23.144 18.5509 23.144C20.4756 23.144 21.0784 23.9997 22.6256 23.9997C24.2284 23.9997 25.3344 22.804 26.5741 21.1472C27.977 19.2316 28.5656 17.366 28.5867 17.284C28.5234 17.2565 24.3394 15.5195 24.3394 11.6325Z" />
                      <path d="M14.5903 3.38907C15.608 2.14032 16.3141 0.45032 16.1336 -0.31543C14.6981 -0.34143 12.9214 0.63507 11.8589 1.8513C10.9081 2.91255 10.0497 4.6463 10.2525 5.5C11.8714 5.5847 13.5374 4.6303 14.5903 3.38907Z" />
                    </svg>
                    App Store
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.9579 8.5242C15.5162 7.217 12.2731 5.9342 10.0289 5.0035C8.9191 4.5324 7.88001 4.3587 6.92293 4.5324C6.22158 4.6546 5.61851 4.9761 5.1295 5.4444C4.4553 6.1334 4.10602 7.1158 4.05551 8.294C3.98357 10.0078 4.62886 12.5336 5.42339 15.0379C6.0175 16.8523 6.71885 18.6168 7.55441 20.1053C8.13606 21.1366 8.81602 22.0173 9.67399 22.6554C10.381 23.1752 11.186 23.4452 12.0653 23.3987C12.858 23.3479 13.6364 23.0705 14.384 22.6554C15.4182 22.0848 16.3897 21.1998 17.3019 20.0468C18.4403 18.607 19.4888 16.8037 20.4283 14.7872C20.9762 13.5531 21.486 12.223 21.8424 10.9377C22.1483 9.8527 22.3224 8.8224 21.9301 7.9165C21.6746 7.3483 21.2138 6.9201 20.6478 6.6686C19.8677 6.3242 18.9265 6.3222 17.9579 6.5471V8.5242ZM14.6828 1.2285C14.6828 1.8179 14.5519 2.3747 14.2965 2.9C13.9784 3.5866 13.512 4.213 12.9894 4.7512C12.3299 5.4204 11.5764 5.9051 10.9388 6.1437C10.5394 6.2949 10.0634 6.4187 9.56539 6.4187C9.41112 6.4187 9.26289 6.4058 9.12364 6.3822C9.11466 6.3293 9.10567 6.2763 9.10567 6.2213C9.10567 5.6597 9.21045 5.0942 9.42899 4.5486C9.65651 3.9782 9.98439 3.4218 10.407 2.9129C11.2762 1.8507 12.5214 1.1661 13.8963 1.0081C14.1511 0.9768 14.398 0.9606 14.6405 0.9606C14.6558 0.9606 14.6693 0.9606 14.6828 0.9606V1.2285Z" />
                    </svg>
                    Google Play
                  </a>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
                  <img
                    src="/api/placeholder/600/400"
                    alt="Trading App Interface"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 z-0"></div>
                </div>
              </div>
            </div>
          </div>

          <div id="pricing" className="bg-gray-800 py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Choose the plan that fits your trading style and goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-900 rounded-xl p-8 hover:transform hover:scale-105 transition duration-300">
                  <h3 className="text-xl font-semibold mb-4">Basic</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Perfect for beginners looking to explore the markets.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Basic Market Analysis</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>5 Trades Per Day</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Standard Fees</span>
                    </li>
                    <li className="flex items-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Advanced Trading Tools</span>
                    </li>
                  </ul>
                  <a
                    href="#"
                    className="block bg-gray-800 hover:bg-gray-700 text-center py-3 rounded-lg font-medium transition"
                  >
                    Get Started
                  </a>
                </div>

                <div className="bg-blue-900 rounded-xl p-8 transform scale-105 shadow-xl relative z-10">
                  <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    POPULAR
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Pro</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-300 mb-6">
                    For active traders looking for more power and features.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Advanced Analytics</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Unlimited Trades</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Reduced Fees (0.5%)</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Trading Signals</span>
                    </li>
                  </ul>
                  <a
                    href="#"
                    className="block bg-blue-600 hover:bg-blue-700 text-center py-3 rounded-lg font-medium transition"
                  >
                    Start Pro Trial
                  </a>
                </div>

                <div className="bg-gray-900 rounded-xl p-8 hover:transform hover:scale-105 transition duration-300">
                  <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Custom solutions for professional traders and institutions.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>AI Trading Assistant</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Premium API Access</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Lowest Fees (0.1%)</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-400 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Dedicated Support</span>
                    </li>
                  </ul>
                  <a
                    href="#"
                    className="block bg-gray-800 hover:bg-gray-700 text-center py-3 rounded-lg font-medium transition"
                  >
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div id="testimonials" className="bg-gray-900 py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  What Our Traders Say
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Join thousands of satisfied traders who've transformed their
                  trading experience with Tradosphere.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="testimonial-gradient rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 mr-4">
                      <img
                        src="/api/placeholder/64/64"
                        alt="User"
                        className="h-12 w-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">Sarah Johnson</h4>
                      <p className="text-sm text-gray-400">Day Trader</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "The AI-powered insights have transformed my trading
                    strategy. I've seen a 32% increase in my portfolio since
                    switching to Tradosphere."
                  </p>
                </div>

                {/* Testimonial 2 */}
                <div className="testimonial-gradient rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 mr-4">
                      <img
                        src="/api/placeholder/64/64"
                        alt="User"
                        className="h-12 w-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">Michael Chen</h4>
                      <p className="text-sm text-gray-400">Forex Trader</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "The real-time market analysis tools are incredible. I can
                    make better decisions faster, and the customizable alerts
                    help me never miss an opportunity."
                  </p>
                </div>

                {/* Testimonial 3 */}
                <div className="testimonial-gradient rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 mr-4">
                      <img
                        src="/api/placeholder/64/64"
                        alt="User"
                        className="h-12 w-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">Alexandra Rodriguez</h4>
                      <p className="text-sm text-gray-400">Crypto Investor</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "As a crypto trader, the volatility can be challenging.
                    Tradosphere's predictive analytics have helped me stay ahead
                    of market trends and make more informed decisions."
                  </p>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
                  Read More Success Stories
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
