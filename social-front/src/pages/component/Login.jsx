export default function Login() {
    return (
        <>
        <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <div className="container mx-auto">
            <div className="max-w-md mx-auto my-10">
              <div className="text-center">
                <h1 className="my-3 text-3xl font-semibold text-gray-700">
                  Sign in
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Sign in to access your account
                </p>
              </div>
              <div className="m-7">
                <form action="">
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm text-gray-600"
                    >
                      Email Address
                    </label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                      name="email"
                      id="email"
                      placeholder="you@company.com"
                      className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    />
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <label
                        htmlFor="password"
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        Password
                      </label>
                      <a
                        href="#!"
                        className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                      name="password"
                      id="password"
                      placeholder="Your Password"
                      className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    />
                  </div>
                  <div className="mb-6">
                    <button
                    type="submit"
                      className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                    >
                      Sign in
                    </button>
                  </div>
                  <p className="text-sm text-center text-gray-400">
                    Don't have an account yet?{" "}
                    <a
                      href="#!"
                      className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800"
                    >
                      Sign up
                    </a>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
        </form>
        {/* Footer Mentions */}
        <div className="fixed bottom-5 w-full text-center text-gray-400">
          Crafted with ♡ by{" "}
          <a
            className="text-blue-500"
            target="_blank"
            href="https://web3templates.com/components/"
          >
            Web3Templates
          </a>
        </div>
      </>
    )
  }
  