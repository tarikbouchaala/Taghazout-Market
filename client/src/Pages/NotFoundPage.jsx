import React from 'react'

export default function NotFoundPage() {
    return (
        <main className="grid h-[calc(100vh)] place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-9xl font-semibold text-transparent bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text  ">404</p>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
            </div>
        </main>
    )
}
