import React from 'react'

function ContentPage() {
    return (
        <div>
            <section class="py-8 bg-white z-50 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                <h2 class="font-bold text-3xl">How it Works?</h2>
                <h2 class="text-md text-gray-500">Give mock interview in just 3 simplar easy step</h2>
                <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <a class="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10" href="#">
                        <h2 class="mt-4 text-xl font-bold text-black">Select Story Type</h2>
                        <p class="mt-1 text-sm text-gray-600">Write your story by selecting custom prompt or just select from the list.</p>
                    </a>
                    <a class="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10" href="#">
                        <h2 class="mt-4 text-xl font-bold text-black">Select Images Style </h2>
                        <p class="mt-1 text-sm text-gray-600">Select Image type wether real image, carton or other listed types.</p>
                    </a>
                    <a class="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10" href="#">
                        <h2 class="mt-4 text-xl font-bold text-black">Generate Video</h2>
                        <p class="mt-1 text-sm text-gray-600"> Generate the script, audiofile, caption and finally images for the videos.</p>
                    </a>
                </div>
                <div class="mt-12 text-center">
                    <a href="/dashboard" passHref class="inline-block rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400">Get Started Today</a>
                </div>
            </section>
        </div>
    )
}

export default ContentPage