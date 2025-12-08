import React from 'react';

function Services() {
    return (
        <section className="bg-gray-50 py-12 antialiased dark:bg-gray-900">
            <div className="mx-auto max-w-screen-xl px-6 2xl:px-0">
                <h2 className="text-4xl font-bold text-indigo-900 dark:text-white mb-8 text-center">
                    GoBook Services
                </h2>

                <p className="text-indigo-800 dark:text-indigo-200 text-lg text-center mb-12">
                    Explore all the amazing services GoBook offers to make your reading journey more exciting and seamless!
                </p>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Service 1 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-2">
                            Personalized Recommendations
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Get tailored book suggestions based on your reading habits and favorite genres.
                        </p>
                    </div>

                    {/* Service 2 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-2">
                            Virtual Library
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Browse thousands of books online and access them anytime, anywhere.
                        </p>
                    </div>

                    {/* Service 3 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M5 6h14M5 18h14" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-2">
                            Book Clubs & Events
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Join reading communities, participate in events, and discuss your favorite books with others.
                        </p>
                    </div>

                    {/* Service 4 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7h14v12a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-2">
                            Reading Tracker
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Keep track of the books you read, set reading goals, and monitor your progress easily.
                        </p>
                    </div>

                    {/* Service 5 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M12 4h9M12 12h9M3 6h3m-3 6h3m-3 6h3" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-2">
                            Author Insights
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Read interviews, tips, and insights directly from your favorite authors.
                        </p>
                    </div>

                    {/* Service 6 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c2.21 0 4-1.79 4-4S14.21 0 12 0 8 1.79 8 4s1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6v4h12v-4c0-3.31-2.69-6-6-6z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-2">
                            24/7 Support
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            Get help anytime with our responsive support team ready to assist you.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Services;
