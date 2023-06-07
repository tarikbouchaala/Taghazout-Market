import clients from '../../assets/Images/clients.svg'
import money from '../../assets/Images/money.svg'
import orders from '../../assets/Images/orders.svg'

import SideBar from './Sidebar';
export default function AdminDashboard() {
    return (
        <div className="flex">
            <SideBar />
            <section class="py-3 flex-1">
                <div class="container px-4 mx-auto">
                    <div class="mb-6">
                        <div class="flex flex-wrap -mx-3 -mb-6 justify-evenly">
                            <div class="w-full md:w-1/2 lg:w-1/4 px-3 mb-6">
                                <div class="max-w-sm mx-auto py-8 px-6 bg-gray-100 rounded-xl">
                                    <div class="max-w-xs mx-auto text-center">
                                        <div class="flex mx-auto w-12 h-12 mb-4 items-center justify-center bg-orange-500 bg-opacity-20 rounded-xl">
                                            <img src={clients} alt="" />
                                        </div>
                                        <span class="text-xs text-black font-semibold">Total clients</span>
                                        <h4 class="text-2xl leading-8 text-black font-semibold mb-4">1.6K</h4>

                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 lg:w-1/4 px-3 mb-6">
                                <div class="max-w-sm mx-auto py-8 px-6 bg-gray-100 rounded-xl">
                                    <div class="max-w-xs mx-auto text-center">
                                        <div class="flex mx-auto w-12 h-12 mb-4 items-center justify-center bg-orange-500 bg-opacity-20 rounded-xl">
                                            <img src={orders} alt="" />
                                        </div>
                                        <span class="text-xs text-black font-semibold">Orders</span>
                                        <h4 class="text-2xl leading-8 text-black font-semibold mb-4">64.5%</h4>

                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 lg:w-1/4 px-3 mb-6">
                                <div class="max-w-sm mx-auto py-8 px-6 bg-gray-100 rounded-xl">
                                    <div class="max-w-xs mx-auto text-center">
                                        <div class="flex mx-auto w-12 h-12 mb-4 items-center justify-center bg-orange-500 bg-opacity-20 rounded-xl">
                                            <img src={money} alt="" />
                                        </div>
                                        <span class="text-xs text-black font-semibold">Total profit</span>
                                        <h4 class="text-2xl leading-8 text-black font-semibold mb-4">$23K</h4>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 w-full justify-center ">
                        <div class="w-full px-3">
                            <h4 class="text-lg text-black font-semibold mb-6">Latest Products</h4>
                            <div class="w-full mt-6 pb-4 overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-300">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span class="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr>
                                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div class="flex items-center">
                                                    <div class="h-10 w-10 flex-shrink-0">
                                                        <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="font-medium text-gray-900">Lindsay Walton</div>
                                                        <div class="text-gray-500">lindsay.walton@example.com</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div class="text-gray-900">Front-end Developer</div>
                                                <div class="text-gray-500">Optimization</div>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Active</span>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Member</td>
                                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, Lindsay Walton</span></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="w-full px-3">
                            <h4 class="text-lg text-black font-semibold mb-6">Latest Orders</h4>
                            <div class="w-full mt-6 pb-4 overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-300">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span class="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr>
                                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div class="flex items-center">
                                                    <div class="h-10 w-10 flex-shrink-0">
                                                        <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="font-medium text-gray-900">Lindsay Walton</div>
                                                        <div class="text-gray-500">lindsay.walton@example.com</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div class="text-gray-900">Front-end Developer</div>
                                                <div class="text-gray-500">Optimization</div>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Active</span>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Member</td>
                                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, Lindsay Walton</span></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="w-full px-3">
                            <h4 class="text-lg text-black font-semibold mb-6">Latest Coupons</h4>
                            <div class="w-full mt-6 pb-4 overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-300">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span class="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-200 bg-white">
                                        <tr>
                                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div class="flex items-center">
                                                    <div class="h-10 w-10 flex-shrink-0">
                                                        <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="font-medium text-gray-900">Lindsay Walton</div>
                                                        <div class="text-gray-500">lindsay.walton@example.com</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div class="text-gray-900">Front-end Developer</div>
                                                <div class="text-gray-500">Optimization</div>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Active</span>
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Member</td>
                                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, Lindsay Walton</span></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
