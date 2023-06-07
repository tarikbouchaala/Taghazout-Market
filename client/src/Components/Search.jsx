import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetProducts } from '../Redux/Slices/ProductSlice';
import { GetCategories } from '../Redux/Slices/CategorySlice';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search({ setSearch }) {
    const [searchValue, setSearchValue] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const { Products: products } = useSelector(state => state.Product)
    const { Categories: categories } = useSelector(state => state.Category)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const searchProductByName = () => {
        if (searchValue.trim() != "") {
            const matchingProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setSearchResult(matchingProducts)
        }
    };

    useEffect(() => {
        dispatch(GetProducts())
        dispatch(GetCategories())
    }, [])

    useEffect(() => { searchProductByName() }, [searchValue])

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 __web-inspector-hide-shortcut__" id="headlessui-dialog-330" role="dialog" aria-modal="true" data-headlessui-state="open">
            <div className="fixed inset-0 bg-slate-900/25 backdrop-blur transition-opacity opacity-100" onClick={e => setSearch(false)}></div>
            <div className="lg:w-3/4 relative w-full max-w-2xl transform px-4 transition-all opacity-100 scale-100">
                <div className="overflow-hidden rounded-lg bg-white shadow-md" id="headlessui-dialog-panel-331" data-headlessui-state="open">
                    <div className={searchValue == "blabla" ? "relative shadow-sm" : "relative"}>
                        <MagnifyingGlassIcon className="pointer-events-none absolute right-4 top-4 h-6 w-6 cursor-pointer" />
                        <input autoComplete='off' onChange={e => setSearchValue(e.target.value)} className="block w-full appearance-none bg-transparent py-4 pl-4 pr-12 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none sm:text-sm sm:leading-6" placeholder="Find product" aria-label="Search components" id="headlessui-combobox-input-332" role="combobox" type="text" aria-expanded="false" aria-autocomplete="list" data-headlessui-state="" style={{ caretColor: "rgb(107, 114, 128)" }} tabIndex="0" autoFocus />
                    </div>
                    {searchValue.trim() != "" ?
                        searchResult.length == 0 ?
                            <div className="bg-slate-50 px-16 py-20 text-center">
                                <h2 className="font-semibold text-slate-900">No results found</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600 w-5/6 mx-auto text-center">We can't find a product with that name at the moment, try searching something else</p>
                            </div>
                            :
                            <ul className="max-h-[18.375rem] divide-y divide-slate-200 overflow-y-auto rounded-b-lg border-t border-slate-200 text-sm leading-6">
                                {searchResult.map(product =>
                                    <li key={product.id}
                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gradient-to-r from-red-500 to-yellow-400 hover:text-white"
                                        id="headlessui-combobox-option-181"
                                        onClick={e => {
                                            setSearch(false)
                                            navigate(`/product/${product.id}`)
                                            window.scrollTo(0, 0)
                                        }}>
                                        <div className="flex gap-3 items-center">
                                            <img src={product.images[0].image} alt={`Product Image ${product.images[0].id}`} className='w-14 h-14 rounded-lg' />
                                            <span className="whitespace-nowrap text-lg">{product.name.length > 24 ? `${product.name.slice(0, 24)}...` : product.name}</span>
                                        </div>
                                        <span className="ml-4 text-right text-xs text-slate-600">{categories.find(category => category.id == product.category_id) && categories.find(category => category.id == product.category_id).name}</span>
                                    </li>
                                )}
                            </ul>
                        : null
                    }
                </div>
            </div>
        </div >
    )
}
